from lifeos_ml_entity.utils import flip_dict
from transformers import (
    BertTokenizerFast,
    BertForTokenClassification,
)
import torch
from typing import List, Tuple

EntityPredictions = List[Tuple[str, str, float]]


class EntityPredictor:
    def __init__(self, model_path: str, label_to_id: dict):
        self.model_path = model_path
        self.model = BertForTokenClassification.from_pretrained(model_path)
        self.tokenizer = BertTokenizerFast.from_pretrained("bert-base-uncased")
        self.model.eval()
        self.label_to_id = label_to_id
        self.id_to_label = flip_dict(label_to_id)

    def predict(self, text: str) -> EntityPredictions:
        print("Tokenizing prediction input...")
        inputs = self.tokenizer(
            text,
            is_split_into_words=False,
            return_tensors="pt",
            padding="longest",
            truncation=True,
        )

        if len(inputs["input_ids"]) > 1 or len(inputs["input_ids"][0]) == 0:
            raise ValueError("Unexpected tokenizer result for user input")

        print("Calculating prediction output...")
        with torch.no_grad():
            outputs = self.model(**inputs)

        print("Decoding prediction output...")
        logits = outputs.logits.squeeze(0)
        probabilities = torch.softmax(logits, dim=-1)
        predictions = torch.argmax(logits, dim=-1)

        word_ids = inputs.word_ids()
        tokens = self.tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])

        results = []

        for idx, (token, word_id) in enumerate(zip(tokens, word_ids)):
            if token in ["[CLS]", "[SEP]", "[PAD]"] or word_id is None:
                continue

            label_id = predictions[idx].item()
            confidence = probabilities[idx][predictions[idx]].item()
            results.append((token, self.id_to_label[label_id], confidence))

        return results

    def run_prediction(self, input: str):
        token_predictions = self.predict(input)

        print("\nPredicted entities (token, label, label_id, confidence):")
        for token, label, confidence in token_predictions:
            id = self.label_to_id[label]
            print(f"{token:<25} {label:<15} {id:<5} {confidence:.4f}")

    def run_repl(self):
        print("|-------------------------|")
        print("| LifeOS ML Entity REPL   |")
        print("|-------------------------|")
        print("Running REPL for model:", self.model_path)
        print("Type 'exit' to quit")

        example = "Send email to sarah at sarah@example.com"
        print(f"Triggering example: {example}")
        self.run_prediction(example)

        while True:
            try:
                user_input = input("\nMessage> ")
                if user_input.lower() == "exit":
                    print("Au revoir!")
                    break

                self.run_prediction(user_input)

            except Exception as e:
                print(f"Error processing input: {str(e)}")
                continue
