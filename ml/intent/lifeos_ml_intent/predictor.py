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
        print("Tokenizing prediction input...")
        inputs = self.tokenizer(
            text,
            return_tensors="pt",
            padding="max_length",
            truncation=True,
            max_length=128,
        )

        print("Calculating prediction output...")
        with torch.no_grad():
            outputs = self.model(**inputs)

        print("Decoding prediction output...")
        probabilities = torch.softmax(outputs.logits, dim=-1)
        predicted_label_id = torch.argmax(probabilities, dim=1).item()
        predicted_intent = self.id_to_intent[predicted_label_id]

        confidence_scores = probabilities.squeeze().tolist()

        return predicted_intent, confidence_scores
