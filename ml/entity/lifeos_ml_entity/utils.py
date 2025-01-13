def flip_dict(d):
    return {v: k for k, v in d.items()}


label_to_id = {
    "O": 0,
    "B-email": 1,
    "I-email": 2,
}
