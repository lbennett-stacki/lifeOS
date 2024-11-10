from typing import List, Tuple
from lifeos_ml_intent.utils import flip_dict
from transformers import (
    BertTokenizer,
    BertForSequenceClassification,
    DistilBertTokenizer,
    DistilBertForSequenceClassification,
)
import torch

IntentPrediction = Tuple[str, List[float]]


class IntentPredictor:
    def __init__(self, model_path, intent_to_id, is_distilled=False):
        self.model_path = model_path

        if is_distilled:
            self.model = DistilBertForSequenceClassification.from_pretrained(model_path)
        else:
            self.model = BertForSequenceClassification.from_pretrained(model_path)

        if is_distilled:
            self.tokenizer = DistilBertTokenizer.from_pretrained(
                "distilbert-base-uncased"
            )
        else:
            self.tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

        self.model.eval()

        self.id_to_intent = flip_dict(intent_to_id)

    def predict(self, text) -> IntentPrediction:
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding="max_length",
            truncation=True,
            max_length=128,
        )

        with torch.no_grad():
            outputs = self.model(**inputs)

        probabilities = torch.softmax(outputs.logits, dim=-1)
        predicted_label_id = torch.argmax(probabilities, dim=1).item()
        predicted_intent = self.id_to_intent[predicted_label_id]

        confidence_scores = probabilities.squeeze().tolist()

        return predicted_intent, confidence_scores

    def run_prediction(self, input: str):
        intent, probabilities = self.predict(input)

        print(f"\nPredicted intent: {intent}")
        print("\nConfidence scores:")
        for intent_id, score in enumerate(probabilities):
            intent_name = self.id_to_intent[intent_id]
            print(f"{intent_name}: {score:.4f}")

    def run_repl(self):
        print("|-----------------------|")
        print("| LifeOS ML Intent REPL |")
        print("|-----------------------|")
        print("Running REPL for model:", self.model_path)
        print("Type 'exit' to quit")

        print("Triggering example...")
        self.run_prediction("Send email to sarah at sarah@example.com")

        while True:
            user_input = input("\nMessage> ")

            if user_input.lower() == "exit":
                print("Au revoir!")
                break

            self.run_prediction(user_input)
