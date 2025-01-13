import csv
import matplotlib.pyplot as plt
from lifeos_ml_generate.utils import input_prompt
from transformers import (
    T5TokenizerFast,
    T5ForConditionalGeneration,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
    TrainerCallback,
)
from datasets import Dataset
from typing import List, Dict, Any
import torch
from evaluate import load

rouge = load("rouge")

is_gpu_available = torch.cuda.is_available()

if is_gpu_available:
    torch.cuda.empty_cache()


class MetricsCallback(TrainerCallback):
    def __init__(self):
        self.metric_values = {
            "eval_epoch": [],
            "eval_loss": [],
            "eval_rouge1": [],
            "eval_runtime": [],
            "eval_samples_per_second": [],
        }

    def on_evaluate(self, args, state, control, metrics, **kwargs):
        self.metric_values["eval_epoch"].append(state.epoch)
        for key in self.metric_values.keys():
            if key in metrics:
                self.metric_values[key].append(metrics[key])


compute_tokenizer = T5TokenizerFast.from_pretrained("google/flan-t5-large")


class GenerateTrainer:
    def __init__(
        self,
        data_path: str,
        output_path: str,
    ):
        self.data_path = data_path
        self.output_path = output_path

        self.tokenizer = compute_tokenizer
        self.model = T5ForConditionalGeneration.from_pretrained("google/flan-t5-large")

    def compute_metrics(self, eval_pred):
        preds, labels = eval_pred
        decoded_preds = compute_tokenizer.batch_decode(preds, skip_special_tokens=True)
        decoded_labels = compute_tokenizer.batch_decode(
            labels, skip_special_tokens=True
        )

        decoded_preds = [" ".join(pred.strip().split()) for pred in decoded_preds]
        decoded_labels = [" ".join(label.strip().split()) for label in decoded_labels]

        result = rouge.compute(predictions=decoded_preds, references=decoded_labels)

        rouge1_f1 = result["rouge1"]

        return {"rouge1": rouge1_f1}

    def preprocess_data(self, examples: Dict[str, List[str]]) -> Dict[str, List[Any]]:
        model_inputs = self.tokenizer(
            examples["input"],
            truncation=True,
            padding="longest",
        )

        labels = self.tokenizer(
            examples["output"],
            truncation=True,
            padding="longest",
        )

        model_inputs["labels"] = labels["input_ids"]

        return model_inputs

    def read_csv_blocks(self, file_path: str) -> List[Dict[str, str]]:
        all_samples = []

        with open(file_path, mode="r", encoding="utf-8") as f:
            reader = csv.reader(f)

            for index, row in enumerate(reader):
                if index == 0:
                    continue

                if len(row) < 3:
                    continue

                task, input_text, output_text = row
                # TODO: support additional context
                additional_context = None

                formatted_input = input_prompt(task, input_text, additional_context)

                all_samples.append(
                    {
                        "input": formatted_input,
                        "output": output_text,
                    }
                )

        return all_samples

    def train(self, should_plot=False):
        print("Loading training data...")
        train_data = self.read_csv_blocks(self.data_path)

        if not train_data:
            raise ValueError("No training data found or all data is malformed!")

        dataset = Dataset.from_dict(
            {
                "input": [x["input"] for x in train_data],
                "output": [x["output"] for x in train_data],
            }
        )

        dataset_dict = dataset.train_test_split(test_size=0.1, seed=42)

        tokenized_datasets = dataset_dict.map(
            self.preprocess_data,
            remove_columns=dataset_dict["train"].column_names,
            batched=True,
            batch_size=1000,
        )

        training_args = Seq2SeqTrainingArguments(
            output_dir=f"{self.output_path}/results",
            logging_dir=f"{self.output_path}/logs",
            num_train_epochs=2,
            per_device_train_batch_size=32,
            per_device_eval_batch_size=32,
            learning_rate=5e-5,
            weight_decay=0.01,
            eval_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="rouge1",
            predict_with_generate=True,
            fp16=is_gpu_available,
,
        )

        metrics_callback = MetricsCallback()

        trainer = Seq2SeqTrainer(
            model=self.model,
            args=training_args,
            train_dataset=tokenized_datasets["train"],
            eval_dataset=tokenized_datasets["test"],
            processing_class=self.tokenizer,
            compute_metrics=self.compute_metrics,
            callbacks=[metrics_callback],
        )

        print("Starting training...")
        trainer.train()

        print(f"Saving model to {self.output_path}...")
        trainer.save_model(self.output_path)
        self.tokenizer.save_pretrained(self.output_path)
        print("Training complete!")

        if not should_plot:
            return

        plot_performance(metrics_callback)


def plot_performance(metrics_callback):
    print("Plotting performance...")

    eval_epochs = metrics_callback.metric_values["eval_epoch"]
    eval_loss = metrics_callback.metric_values["eval_loss"]
    eval_rouge1 = metrics_callback.metric_values["eval_rouge1"]

    plt.figure(figsize=(8, 5))
    plt.plot(
        eval_epochs, eval_loss, label="Validation Loss", marker="o", linestyle="--"
    )
    plt.title("Validation Loss over Epochs")
    plt.xlabel("Epoch")
    plt.ylabel("Loss")
    plt.legend()
    plt.grid(True)
    plt.show()

    plt.figure(figsize=(8, 5))
    plt.plot(
        eval_epochs,
        eval_rouge1,
        label="Validation ROUGE-1",
        marker="o",
        linestyle="--",
        color="green",
    )
    plt.title("Validation ROUGE-1 Score over Epochs")
    plt.xlabel("Epoch")
    plt.ylabel("ROUGE-1 Score")
    plt.legend()
    plt.grid(True)
    plt.show()

    print("C'est fini!")
