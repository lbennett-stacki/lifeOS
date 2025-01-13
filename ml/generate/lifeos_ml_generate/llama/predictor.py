from lifeos_ml_generate.utils import format_prompt
from typing import Optional
import torch
from transformers import (
    AutoModelForCausalLM,
    PreTrainedTokenizerFast,
)


GeneratePrediction = str


class GeneratePredictor:
    def __init__(
        self,
        model_path: str,
    ):
        self.model_path = model_path

        self.tokenizer = PreTrainedTokenizerFast.from_pretrained(model_path)
        self.tokenizer.pad_token = self.tokenizer.eos_token

        self.model = AutoModelForCausalLM.from_pretrained(model_path)
        self.model.eval()
        self.model.to("cuda")

    def predict(
        self,
        generatable: str,
        scenario: str,
        additional_context: Optional[str] = None,
    ) -> str:
        print("Formatting input prompt...")
        formatted_input = format_prompt(generatable, scenario, additional_context)
        print("Formatted input", formatted_input)

        print("Tokenizing prediction input...")
        inputs = self.tokenizer(
            formatted_input,
            return_tensors="pt",
            truncation=True,
            max_length=256,
        )
        for key, value in inputs.items():
            inputs[key] = value.to("cuda")

        print("Calculating prediction output...")
        with torch.no_grad():
            outputs = self.model.generate(
                inputs.input_ids,
                attention_mask=inputs.attention_mask,
                max_length=500,
                num_beams=4,
                do_sample=True,
                temperature=0.9,
                top_p=0.8,
                repetition_penalty=1.5,
            )

        print("Decoding prediction output...")
        generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text

    def run_repl(self):
        print("|--------------------------|")
        print("| LifeOS ML Generate REPL  |")
        print("|--------------------------|")
        print("Running REPL for model:", self.model_path)
        print("Type 'exit' to quit")

        print("\n\nTriggering example...")
        generated_example_text = self.predict(
            "email subject",
            "Send an email to Jennifer telling her I will be late",
            None,
        )
        print("\nGenerated example output text:")
        print(generated_example_text)

        print("\n\nTriggering example 2...")
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
