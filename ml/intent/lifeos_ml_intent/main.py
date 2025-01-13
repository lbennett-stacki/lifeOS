from lifeos_ml_intent.http import start_http_server
from lifeos_ml_intent.predictor import IntentPredictor
from lifeos_ml_intent.primary_trainer import PrimaryIntentTrainer
from lifeos_ml_intent.distiller import IntentDistiller
from lifeos_ml_intent.utils import flip_dict, primary_intent_to_id, distiller_config
from lifeos_ml_intent.training_data_cleaner import TrainingDataCleaner
import argparse


def train_contact_distiller(should_plot: bool):
    distiller = IntentDistiller(
        teacher_model_path="./models/primary",
        module_name="contacts",
        primary_intent_to_id=primary_intent_to_id,
        intent_to_id=distiller_config["contacts"],
    )
    distiller.train(
        csv_path="./data/labeled-data.all.csv",
        output_dir="./models/distilled/contacts",
        should_plot=should_plot,
    )


def train_messaging_distiller(should_plot: bool):
    distiller = IntentDistiller(
        teacher_model_path="./models/primary",
        module_name="messaging",
        primary_intent_to_id=primary_intent_to_id,
        intent_to_id=distiller_config["messaging"],
    )
    distiller.train(
        csv_path="./data/labeled-data.all.csv",
        output_dir="./models/distilled/messaging",
        should_plot=should_plot,
    )


def train_primary(should_plot: bool):
    trainer = PrimaryIntentTrainer(primary_intent_to_id)
    trainer.train(
        data_path="./data/labeled-data.all.csv",
        output_path="./models/primary",
        should_plot=should_plot,
    )


def predict_all(user_input, primary_predictor, contacts_predictor, messaging_predictor):
    contacts_intent, contacts_probabilities = contacts_predictor.predict(user_input)
    messaging_intent, messaging_probabilities = messaging_predictor.predict(user_input)
    primary_intent, primary_probabilities = primary_predictor.predict(user_input)

    print(f"\nPredicted contacts intent: {contacts_intent}")
    print(f"\nPredicted messaging intent: {messaging_intent}")
    print(f"\nPredicted primary intent: {primary_intent}")
    print("\nContacts confidence scores:")
    for intent_id, score in enumerate(contacts_probabilities):
        intent_name = flip_dict(distiller_config["contacts"])[intent_id]
        print(f"{intent_name}: {score:.4f}")
    print("\nMessaging confidence scores:")
    for intent_id, score in enumerate(messaging_probabilities):
        intent_name = flip_dict(distiller_config["messaging"])[intent_id]
        print(f"{intent_name}: {score:.4f}")
    print("\nPrimary confidence scores:")
    for intent_id, score in enumerate(primary_probabilities):
        intent_name = flip_dict(primary_intent_to_id)[intent_id]
        print(f"{intent_name}: {score:.4f}")


def predict_repl_all():
    primary_predictor = IntentPredictor(
        "./models/primary", intent_to_id=primary_intent_to_id
    )

    contacts_predictor = IntentPredictor(
        "./models/distilled/contacts/contacts_distilled",
        intent_to_id=distiller_config["contacts"],
        is_distilled=True,
    )

    messaging_predictor = IntentPredictor(
        "./models/distilled/messaging/messaging_distilled",
        intent_to_id=distiller_config["messaging"],
        is_distilled=True,
    )

    print("|-----------------------|")
    print("| LifeOS ML Intent REPL |")
    print("|-----------------------|")
    print("Running REPL for ALL models!")
    print("Type 'exit' to quit")

    example = "Send email to sarah at sarah@example.com"
    print(f"Triggering example: {example}")
    predict_all(
        example,
        primary_predictor,
        contacts_predictor,
        messaging_predictor,
    )

    while True:
        user_input = input("\nMessage> ")

        if user_input.lower() == "exit":
            print("Au revoir!")
            break

        predict_all(
            user_input, primary_predictor, contacts_predictor, messaging_predictor
        )


def train_distilled(should_plot: bool):
    train_contact_distiller(should_plot)
    train_messaging_distiller(should_plot)


def clean_training_data():
    all_cleaner = TrainingDataCleaner("./data/labeled-data.all.csv")
    contacts_cleaner = TrainingDataCleaner("./data/labeled-data.contacts.csv")
    messaging_cleaner = TrainingDataCleaner("./data/labeled-data.messaging.csv")

    all_cleaner.clean()
    contacts_cleaner.clean()
    messaging_cleaner.clean()

    print("Cleaned!")


def main():
    parser = argparse.ArgumentParser(
        description="Train and use intent recognition models."
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
        train_primary(args.plot)
        train_distilled(args.plot)

    if args.http:
        start_http_server()

    if args.repl:
        predict_repl_all()


if __name__ == "__main__":
    main()
