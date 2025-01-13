import csv
import torch
from lifeos_ml_generate.utils import format_prompt
from transformers import (
    Trainer,
    TrainingArguments,
    LlamaForCausalLM,
    PreTrainedTokenizerFast,
    DataCollatorForLanguageModeling,
)
from datasets import Dataset
from typing import List, Dict, Any


model_path = "meta-llama/Llama-3.2-1B"

is_gpu_available = torch.cuda.is_available()


class GenerateTrainer:
    def __init__(
        self,
        data_path: str,
        output_path: str,
    ):
        self.data_path = data_path
        self.output_path = output_path

        self.tokenizer = PreTrainedTokenizerFast.from_pretrained(
            model_path, legacy=False
        )
        self.tokenizer.pad_token = self.tokenizer.eos_token

        self.model = LlamaForCausalLM.from_pretrained(model_path)
        self.model.gradient_checkpointing_enable()

    def preprocess_data(self, examples: Dict[str, List[str]]) -> Dict[str, List[Any]]:
        model_inputs = self.tokenizer(
            examples["text"],
            truncation=True,
            max_length=256,
            return_attention_mask=True,
        )

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

                training_rows = format_prompt(
                    task, input_text, additional_context, output_text
                )

                all_samples.append(training_rows)

        return all_samples

    def train(self, should_plot=False):
        print("Loading training data...")
        train_data = self.read_csv_blocks(self.data_path)

        if not train_data:
            raise ValueError("No training data found or all data is malformed!")

        dataset = Dataset.from_dict({"text": train_data})

        dataset_dict = dataset.train_test_split(test_size=0.1, seed=42)

        tokenized_datasets = dataset_dict.map(
            self.preprocess_data,
            remove_columns=dataset_dict["train"].column_names,
            batched=True,
        )

        data_collator = DataCollatorForLanguageModeling(
            tokenizer=self.tokenizer, mlm=False, pad_to_multiple_of=8
        )

        training_args = TrainingArguments(
            output_dir=f"{self.output_path}/results",
            logging_dir=f"{self.output_path}/logs",
            num_train_epochs=5,
            per_device_train_batch_size=16,
            per_device_eval_batch_size=16,
            learning_rate=2e-5,
            weight_decay=0.01,
            eval_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            fp16=is_gpu_available,
            gradient_accumulation_steps=2,
        )

        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=tokenized_datasets["train"],
            eval_dataset=tokenized_datasets["test"],
            tokenizer=self.tokenizer,
            data_collator=data_collator,
        )

        print("Starting training...")
        trainer.train()

        print(f"Saving model to {self.output_path}...")
        trainer.save_model(self.output_path)
        self.tokenizer.save_pretrained(self.output_path)
        print("Training complete!")

        if not should_plot:
            return

        print("Llama training performance graph not yet implemented!")
