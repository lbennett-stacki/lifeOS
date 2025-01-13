def flip_dict(d):
    return {v: k for k, v in d.items()}


primary_intent_to_id = {
    "send_sms": 0,
    "send_email": 1,
    "add_contact": 2,
    "search_contact": 3,
}

distiller_config = {
    "contacts": {
        "add_contact": 0,
        "search_contact": 1,
    },
    "messaging": {
        "send_email": 0,
        "send_sms": 1,
    },
}
