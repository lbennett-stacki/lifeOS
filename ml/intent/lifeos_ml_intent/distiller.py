from transformers import (
    BertForSequenceClassification,
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
    TrainingArguments,
    TrainerCallback,
)
from lifeos_ml_intent.distillation_trainer import DistillationTrainer
import torch
import numpy as np
import matplotlib.pyplot as plt
import torch.nn.functional as F
from datasets import load_dataset
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


class IntentDistiller:
    def __init__(
        self, teacher_model_path, module_name, primary_intent_to_id, intent_to_id
    ):
        self.teacher = BertForSequenceClassification.from_pretrained(teacher_model_path)
        self.teacher.eval()

        self.tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

        self.intent_to_id = intent_to_id
        self.primary_intent_to_id = primary_intent_to_id
        self.module_name = module_name

        self.model = DistilBertForSequenceClassification.from_pretrained(
            "distilbert-base-uncased",
            num_labels=len(self.intent_to_id),
        )

        self.temperature = 2.0

    def prepare_dataset(self, csv_path):
        dataset = load_dataset("csv", data_files=csv_path)

        filtered_data = dataset["train"].filter(
            lambda x: x["intent"] in self.intent_to_id
        )

        def generate_soft_labels(examples):
            inputs = self.tokenizer(
                examples["text"],
                padding="longest",
                truncation=True,
                return_tensors="pt",
            )

            with torch.no_grad():
                teacher_outputs = self.teacher(**inputs)

                soft_logits = teacher_outputs.logits / self.temperature
                soft_probs = F.softmax(soft_logits, dim=-1)

                columns_to_keep = [
                    self.primary_intent_to_id[intent] for intent in self.intent_to_id
                ]
                soft_probs = soft_probs[:, columns_to_keep]

            relevant_indices = [
                self.intent_to_id[intent] for intent in examples["intent"]
            ]

            return {
                "input_ids": inputs["input_ids"],
                "attention_mask": inputs["attention_mask"],
                "labels": relevant_indices,
                "teacher_probs": soft_probs.numpy(),
            }

        processed_dataset = filtered_data.map(
            generate_soft_labels,
            batched=True,
            remove_columns=filtered_data.column_names,
        )

        return processed_dataset

    def train(self, csv_path, output_dir, should_plot):
        print(f"Preparing dataset for distilled {self.module_name} training...")

        dataset = self.prepare_dataset(csv_path)
        train_test_split = dataset.train_test_split(test_size=0.2)

        training_args = TrainingArguments(
            output_dir=f"{output_dir}/results",
            logging_dir=f"{output_dir}/logs",
            eval_strategy="steps",
            save_strategy="steps",
            eval_steps=5,
            save_steps=5,
            learning_rate=5e-5,
            per_device_train_batch_size=64,
            per_device_eval_batch_size=64,
            num_train_epochs=3,
            weight_decay=0.01,
            remove_unused_columns=False,
            load_best_model_at_end=True,
            metric_for_best_model="loss",
            fp16=is_gpu_available,
        )

        metrics_callback = MetricsCallback()

        trainer = DistillationTrainer(
            model=self.model,
            args=training_args,
            train_dataset=train_test_split["train"],
            eval_dataset=train_test_split["test"],
            temperature=self.temperature,
            alpha=0.5,
            compute_metrics=compute_metrics,
            callbacks=[metrics_callback],
        )

        print(f"Training distilled model for {self.module_name} module...")
        trainer.train()

        self.model.save_pretrained(f"{output_dir}/{self.module_name}_distilled")
        print(f"Saved distilled model to {output_dir}/{self.module_name}_distilled")

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
        plt.title(f"{self.module_name} Intent classification metrics over epochs")
        plt.xlabel("Epoch")
        plt.ylabel("Score")
        plt.legend()
        plt.grid(True)
        plt.show()
