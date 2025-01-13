import csv
import torch
from transformers import (
    BertTokenizerFast,
    BertForTokenClassification,
    Trainer,
    TrainingArguments,
    TrainerCallback,
)
from datasets import Dataset, DatasetDict
import matplotlib.pyplot as plt
import numpy as np
from seqeval.metrics import precision_score, recall_score, f1_score

is_gpu_available = torch.cuda.is_available()


class MetricsCallback(TrainerCallback):
    def __init__(self):
        self.metric_values = {
            "eval_precision": [],
            "eval_recall": [],
            "eval_f1": [],
            "eval_epoch": [],
        }

    def on_evaluate(self, args, state, control, metrics, **kwargs):
        if "eval_precision" in metrics:
            self.metric_values["eval_precision"].append(metrics["eval_precision"])
            self.metric_values["eval_recall"].append(metrics["eval_recall"])
            self.metric_values["eval_f1"].append(metrics["eval_f1"])
            self.metric_values["eval_epoch"].append(state.epoch)


class EntityTrainer:
    def __init__(self, label_to_id, data_path, output_path):
        self.label_to_id = label_to_id
        self.data_path = data_path
        self.output_path = output_path
        self.debug = True
        self.id_to_label = {v: k for k, v in label_to_id.items()}

        self.tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
        self.model = BertForTokenClassification.from_pretrained(
            "bert-base-uncased",
            num_labels=len(label_to_id),
        )

    def read_csv_blocks(self, file_path):
        all_samples = []
        tokens, tags = [], []

        with open(file_path, mode="r", encoding="utf-8") as f:
            reader = csv.reader(f)

            for row in reader:
                if (
                    len(row) != 2
                    or row[0].lower() == "token"
                    and row[1].lower() == "tag"
                ):
                    if tokens:
                        all_samples.append({"tokens": tokens, "tags": tags})
                    tokens, tags = [], []
                    continue

                token, tag = row
                tokens.append(token)
                tags.append(tag)

            if tokens:
                all_samples.append({"tokens": tokens, "tags": tags})

        return all_samples

    def build_char_to_word_map(self, tokens):
        joined_string = " ".join(tokens)
        char_to_word = [-1] * len(joined_string)

        current_pos = 0
        for token_idx, token in enumerate(tokens):
            while (
                current_pos < len(joined_string) and joined_string[current_pos] == " "
            ):
                current_pos += 1

            start = current_pos
            end = start + len(token)
            for c in range(start, end):
                char_to_word[c] = token_idx

            current_pos = end

        return char_to_word, joined_string

    def align_predictions(self, predictions, label_ids):
        preds = np.argmax(predictions, axis=2)
        batch_size, seq_len = preds.shape

        out_pred_list = []
        out_label_list = []

        for i in range(batch_size):
            pred_ids_i = preds[i]
            label_ids_i = label_ids[i]

            pred_label_strs = []
            true_label_strs = []
            for p, l in zip(pred_ids_i, label_ids_i):
                if l == -100:
                    continue

                pred_label_strs.append(self.id_to_label[p])
                true_label_strs.append(self.id_to_label[l])

            out_pred_list.append(pred_label_strs)
            out_label_list.append(true_label_strs)

        return out_pred_list, out_label_list

    def compute_metrics(self, eval_pred):
        predictions, label_ids = eval_pred
        pred_list, out_label_list = self.align_predictions(predictions, label_ids)

        precision = precision_score(out_label_list, pred_list)
        recall = recall_score(out_label_list, pred_list)
        f1 = f1_score(out_label_list, pred_list)

        return {
            "precision": precision,
            "recall": recall,
            "f1": f1,
        }

    def tokenize_and_align_labels(self, examples):
        looks_like_user_input = [
            " ".join(token_list) for token_list in examples["tokens"]
        ]

        tokenized_inputs = self.tokenizer(
            looks_like_user_input,
            truncation=True,
            padding="longest",
            is_split_into_words=False,
            return_offsets_mapping=True,
        )

        all_labels = []
        for i in range(len(examples["tokens"])):
            original_tags = examples["tags"][i]
            original_tokens = examples["tokens"][i]
            offsets = tokenized_inputs["offset_mapping"][i]

            char_to_word, _ = self.build_char_to_word_map(original_tokens)

            labels = []
            prev_word_idx = None

            for start_char, end_char in offsets:
                if start_char == 0 and end_char == 0:
                    labels.append(-100)
                    continue

                subword_word_idxs = []
                for c in range(start_char, end_char):
                    if c < len(char_to_word):
                        subword_word_idxs.append(char_to_word[c])

                if len(subword_word_idxs) == 0:
                    labels.append(-100)
                    continue

                word_idx = subword_word_idxs[0]

                original_label = original_tags[word_idx]

                if word_idx != prev_word_idx:
                    label = original_label
                else:
                    if original_label.startswith("B-"):
                        label = "I-" + original_label[2:]
                    else:
                        label = original_label

                label_id = self.label_to_id[label]

                labels.append(label_id)
                prev_word_idx = word_idx

            all_labels.append(labels)

        tokenized_inputs["labels"] = all_labels
        tokenized_inputs.pop("offset_mapping")

        if self.debug:
            for i in range(min(1, len(all_labels))):
                tokens = self.tokenizer.convert_ids_to_tokens(
                    tokenized_inputs["input_ids"][i]
                )
                labels = all_labels[i]
                print(f"\nTraining Data Slice Example {i + 1}:")
                for token, label_id in zip(tokens, labels):
                    if label_id != -100:
                        label = self.id_to_label.get(label_id, "O")
                        print(f"{token:15} {label}")

        return tokenized_inputs

    def train(self, should_plot=False):
        print("Loading CSV blocks for entity extraction training...")
        samples = self.read_csv_blocks(self.data_path)
        if not samples:
            raise ValueError("No training data found!")

        raw_dataset = Dataset.from_list(samples)
        dataset = DatasetDict({"train": raw_dataset})

        tokenized_dataset = dataset.map(
            self.tokenize_and_align_labels,
            batched=True,
            remove_columns=dataset["train"].column_names,
        )

        split_dataset = tokenized_dataset["train"].train_test_split(
            test_size=0.2,
            seed=42,
        )

        training_args = TrainingArguments(
            output_dir=f"{self.output_path}/results",
            eval_strategy="steps",
            save_strategy="steps",
            eval_steps=2,
            save_steps=2,
            learning_rate=5e-5,
            per_device_train_batch_size=64,
            per_device_eval_batch_size=64,
            num_train_epochs=4,
            weight_decay=0.01,
            logging_dir=f"{self.output_path}/logs",
            load_best_model_at_end=True,
            metric_for_best_model="loss",
            fp16=is_gpu_available,
        )

        metrics_callback = MetricsCallback()

        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=split_dataset["train"],
            eval_dataset=split_dataset["test"],
            compute_metrics=self.compute_metrics,
            callbacks=[metrics_callback],
        )

        print("Training entity extraction model...")
        trainer.train()

        print(f"Saving model to {self.output_path}...")
        trainer.save_model(self.output_path)
        print("Training complete!")

        if not should_plot:
            return

        print("Plotting performance...")

        eval_precision = metrics_callback.metric_values["eval_precision"]
        eval_recall = metrics_callback.metric_values["eval_recall"]
        eval_f1 = metrics_callback.metric_values["eval_f1"]
        eval_epochs = metrics_callback.metric_values["eval_epoch"]

        plt.figure(figsize=(8, 5))
        plt.plot(eval_epochs, eval_precision, label="Val Precision", marker="o")
        plt.plot(eval_epochs, eval_recall, label="Val Recall", marker="o")
        plt.plot(eval_epochs, eval_f1, label="Val F1", marker="o")
        plt.title("Entity classification metrics over epochs")
        plt.xlabel("Epoch")
        plt.ylabel("Score")
        plt.legend()
        plt.grid(True)
        plt.show()

        print("C'est fini!")
