from lifeos_ml_generate.utils import input_prompt
from transformers import (
    T5TokenizerFast,
    T5ForConditionalGeneration,
)
from typing import Optional
import torch

GeneratePrediction = str


class GeneratePredictor:
    def __init__(
        self,
        model_path: str,
    ):
        self.model_path = model_path

        self.tokenizer = T5TokenizerFast.from_pretrained(model_path)
        self.model = T5ForConditionalGeneration.from_pretrained(model_path)
        self.model.eval()

    def predict(
        self,
        generatable: str,
        scenario: str,
        additional_context: Optional[str] = None,
    ) -> str:
        formatted_input = input_prompt(generatable, scenario, additional_context)

        inputs = self.tokenizer(
            formatted_input,
            return_tensors="pt",
            truncation=True,
            padding="longest",
        )

        with torch.no_grad():
            outputs = self.model.generate(
                inputs.input_ids,
                max_length=1000,
                num_beams=4,
                do_sample=True,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.2,
            )

        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text

    def run_repl(self):
        print("|--------------------------|")
        print("| LifeOS ML Generate REPL  |")
        print("|--------------------------|")
        print("Running REPL for model:", self.model_path)
        print("Type 'exit' to quit")

        print("Triggering example...")
        generated_example_text = self.predict(
            "email subject",
            "Send an email to Jennifer telling her I will be late",
            None,
        )
        print("\nGenerated example output text:")
        print(generated_example_text)

        print("Triggering example 2...")
        generated_example_text = self.predict(
            "email body",
            "Send an email to Jennifer telling her I will be late. Its because of tube issues and I'm only 10 minutes late right now. Will update if any changes.",
            None,
        )
        print("\nGenerated example 2 output text:")
        print(generated_example_text)

        while True:
            try:
                generatable = input("\nTask (e.g., 'email subject'): ")
                if generatable.lower() == "exit":
                    print("Goodbye!")
                    break

                scenario = input("Input text: ")
                if scenario.lower() == "exit":
                    print("Goodbye!")
                    break

                print("Generatable is", generatable)
                print("Scenario is", scenario)
                generated_text = self.predict(generatable, scenario, None)
                print("\nGenerated text:")
                print(generated_text)

            except Exception as e:
                print(f"Error: {str(e)}")
                continue
