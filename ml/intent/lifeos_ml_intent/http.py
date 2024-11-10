from fastapi import FastAPI, Request, HTTPException
from lifeos_ml_intent.predictor import IntentPrediction, IntentPredictor
import uvicorn
from lifeos_ml_intent.utils import primary_intent_to_id
from concurrent.futures import ThreadPoolExecutor
import asyncio

app = FastAPI()


predictor = None
executor = ThreadPoolExecutor(max_workers=4)


async def run_inference(predictor, input):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, predictor.predict, input)


@app.post("/predict", response_model=IntentPrediction)
async def predict(
    request: Request,
) -> IntentPrediction:
    global predictor
    if predictor is None:
        predictor = IntentPredictor(
            "./models/primary", intent_to_id=primary_intent_to_id
        )

    data = await request.json()
    input = data.get("input", None)

    if input is None or input == "":
        raise HTTPException(status_code=400, detail="No input provided")

    print("\n\nRunning intent prediction on", input)

    result = await run_inference(predictor, input)

    print("\nGot intent prediction on", result)

    return result


def start_http_server(host: str = "0.0.0.0", port: int = 6000):
    uvicorn.run(app, host=host, port=port)
