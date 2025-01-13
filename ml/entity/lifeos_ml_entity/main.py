from lifeos_ml_entity.entity_trainer import EntityTrainer
from lifeos_ml_entity.http import start_http_server
from lifeos_ml_entity.predictor import EntityPredictor
from lifeos_ml_entity.training_data_cleaner import TrainingDataCleaner
from lifeos_ml_entity.utils import label_to_id
import argparse


def train_email(should_plot: bool):
    trainer = EntityTrainer(
        label_to_id=label_to_id,
        data_path="./data/labeled-data.email.csv",
        output_path="./models/email",
    )

    trainer.train(should_plot)


def predict_email():
    predictor = EntityPredictor("./models/email", label_to_id=label_to_id)
    predictor.run_repl()


def clean_training_data():
    cleaner = TrainingDataCleaner("./data/labeled-data.email.csv")
    cleaner.clean()


def main():
    parser = argparse.ArgumentParser(
        description="Train and use entity recognition models"
    )
    parser.add_argument(
        "--train",
        action="store_true",
        help="Train models",
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
    parser.add_argument(
        "--plot",
        action="store_true",
        help="Display a performance chart for the training process",
    )
    args = parser.parse_args()

    if args.clean:
        clean_training_data()

    if args.train:
        train_email(args.plot)

    if args.http:
        start_http_server()

    if args.repl:
        predict_email()


if __name__ == "__main__":
    main()
