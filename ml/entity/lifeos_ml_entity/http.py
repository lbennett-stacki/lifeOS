from fastapi import FastAPI, Request, HTTPException
from lifeos_ml_entity.predictor import EntityPredictions, EntityPredictor
import uvicorn
from lifeos_ml_entity.utils import label_to_id
from concurrent.futures import ThreadPoolExecutor
import asyncio

app = FastAPI()


predictor = None
executor = ThreadPoolExecutor(max_workers=4)


async def run_inference(predictor, input):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, predictor.predict, input)


@app.post("/predict", response_model=EntityPredictions)
async def predict(
    request: Request,
) -> EntityPredictions:
    global predictor
    if predictor is None:
        predictor = EntityPredictor("./models/email", label_to_id=label_to_id)

    data = await request.json()
    input = data.get("input", None)

    if input is None or input == "":
        raise HTTPException(status_code=400, detail="No input provided")

    print("\n\nRunning entity prediction on", input)

    result = await run_inference(predictor, input)

    print("\nGot entity prediction", result)

    return result


def start_http_server(host: str = "0.0.0.0", port: int = 6001):
    uvicorn.run(app, host=host, port=port)
