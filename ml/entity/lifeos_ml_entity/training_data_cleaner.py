import pandas as pd


class TrainingDataCleaner:
    def __init__(self, path: str):
        self.path = path

    def clean(self, keep="first"):
        df = pd.read_csv(self.path)

        repeated_header_mask = df.apply(
            lambda row: all(str(row[col]) == col for col in df.columns), axis=1
        )
        df["is_repeated_header"] = repeated_header_mask
        df["is_duplicate"] = df.duplicated(keep=keep)
        df = df[(~df["is_duplicate"]) | (df["is_repeated_header"])]
        df["block_id"] = repeated_header_mask.cumsum()

        def block_has_bemail(sub_df):
            non_header_rows = sub_df[~sub_df["is_repeated_header"]]
            return (non_header_rows["tag"] == "B-email").any()

        block_mask = df.groupby("block_id").apply(block_has_bemail)
        df["block_has_bemail"] = df["block_id"].map(block_mask)
        df = df[df["block_has_bemail"]]

        df.drop(
            columns=[
                "is_repeated_header",
                "is_duplicate",
                "block_id",
                "block_has_bemail",
            ],
            inplace=True,
        )

        df.to_csv(self.path, index=False)
