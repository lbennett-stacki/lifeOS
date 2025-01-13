import pandas as pd


class TrainingDataCleaner:
    def __init__(self, path: str):
        self.path = path

    def clean(self, keep="first"):
        df = pd.read_csv(self.path)
        df = df.drop_duplicates(keep=keep)
        df.to_csv(self.path, index=False)
