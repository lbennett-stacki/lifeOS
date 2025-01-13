from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    Trainer,
    TrainingArguments,
    TrainerCallback,
)
from datasets import load_dataset
import numpy as np
import torch
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, precision_recall_fscore_support


is_gpu_available = torch.cuda.is_available()


class MetricsCallback(TrainerCallback):
    def __init__(self):
        self.metrics_log = {
            "eval_accuracy": [],
            "eval_precision": [],
            "eval_recall": [],
            "eval_f1": [],
            "eval_epoch": [],
        }

    def on_evaluate(self, args, state, control, metrics, **kwargs):
        if "eval_accuracy" in metrics:
            self.metrics_log["eval_accuracy"].append(metrics["eval_accuracy"])
            self.metrics_log["eval_precision"].append(metrics["eval_precision"])
            self.metrics_log["eval_recall"].append(metrics["eval_recall"])
            self.metrics_log["eval_f1"].append(metrics["eval_f1"])
            self.metrics_log["eval_epoch"].append(state.epoch)


def compute_metrics(eval_pred):
    predictions, labels = eval_pred
    preds = np.argmax(predictions, axis=1)

    accuracy = accuracy_score(labels, preds)
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, preds, average="weighted"
    )

    return {"accuracy": accuracy, "precision": precision, "recall": recall, "f1": f1}


class PrimaryIntentTrainer:
    def __init__(self, intent_to_id):
        self.intent_to_id = intent_to_id
        self.id_to_intent = {v: k for k, v in self.intent_to_id.items()}

        self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
        self.model = BertForSequenceClassification.from_pretrained(
            "bert-base-uncased", num_labels=len(self.intent_to_id)
        )

    def preprocess_data(self, examples):
        tokenized = self.tokenizer(
            examples["text"],
            padding="longest",
            truncation=True,
        )

        tokenized["labels"] = [
            self.intent_to_id[intent] for intent in examples["intent"]
        ]

        return tokenized

    def train(self, data_path, output_path, should_plot):
        print("Loading dataset for primary training...")
        dataset = load_dataset("csv", data_files=data_path)

        print("Preprocessing primary trainer dataset...")
        tokenized_dataset = dataset.map(
            self.preprocess_data,
            batched=True,
            remove_columns=dataset["train"].column_names,
        )

        split_dataset = tokenized_dataset["train"].train_test_split(
            test_size=0.2,
            seed=42,
        )

        training_args = TrainingArguments(
            output_dir=f"{output_path}/results",
            logging_dir=f"{output_path}/logs",
            eval_strategy="steps",
            save_strategy="steps",
            eval_steps=5,
            save_steps=5,
            learning_rate=5e-5,
            per_device_train_batch_size=64,
            per_device_eval_batch_size=64,
            num_train_epochs=3,
            weight_decay=0.01,
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
            compute_metrics=compute_metrics,
            callbacks=[metrics_callback],
        )

        print("Training primary intent model...")
        trainer.train()

        print(f"Saving model to {output_path}...")
        trainer.save_model(output_path)
        print("Training complete!")

        if not should_plot:
            return

        metrics_log = metrics_callback.metrics_log
        eval_epochs = metrics_log["eval_epoch"]
        eval_accuracy = metrics_log["eval_accuracy"]
        eval_precision = metrics_log["eval_precision"]
        eval_recall = metrics_log["eval_recall"]
        eval_f1 = metrics_log["eval_f1"]

        plt.figure(figsize=(8, 5))
        plt.plot(eval_epochs, eval_accuracy, label="Val Accuracy", marker="o")
        plt.plot(eval_epochs, eval_precision, label="Val Precision", marker="o")
        plt.plot(eval_epochs, eval_recall, label="Val Recall", marker="o")
        plt.plot(eval_epochs, eval_f1, label="Val F1", marker="o")
        plt.title("Intent classification metrics over epochs")
        plt.xlabel("Epoch")
        plt.ylabel("Score")
        plt.legend()
        plt.grid(True)
        plt.show()
