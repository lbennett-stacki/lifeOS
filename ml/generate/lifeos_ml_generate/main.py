from lifeos_ml_generate.deepseek.trainer import GenerateTrainer
from lifeos_ml_generate.http import start_http_server
from lifeos_ml_generate.deepseek.predictor import GeneratePredictor
from lifeos_ml_generate.training_data_cleaner import TrainingDataCleaner
import argparse


def train():
    trainer = GenerateTrainer(
        output_path="./models/generate",
        data_path="./data/example-data.csv",
    )
    trainer.train()


def predict():
    predictor = GeneratePredictor("./models/generate")
    predictor.run_repl()


def clean_training_data():
    cleaner = TrainingDataCleaner("./data/example-data.csv")
    cleaner.clean()


def main():
    parser = argparse.ArgumentParser(description="Train and use generate model")
    parser.add_argument(
        "--train",
        action="store_true",
        help="Train model",
    )
    parser.add_argument(
        "--repl",
        action="store_true",
        help="Starts a CLI inference REPL",
    )
    parser.add_argument(
        "--http",
        action="store_true",
        help="Starts a HTTP inference server",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Cleans training data",
    )
    args = parser.parse_args()

    if args.clean:
        clean_training_data()

    if args.train:
        train()

    if args.http:
        start_http_server()

    if args.repl:
        predict()


if __name__ == "__main__":
    main()
