from fastapi import FastAPI, Request, HTTPException
from lifeos_ml_generate.llama.predictor import GeneratePrediction, GeneratePredictor
import uvicorn
from concurrent.futures import ThreadPoolExecutor
import asyncio


app = FastAPI()


predictor = None
executor = ThreadPoolExecutor(max_workers=4)


@app.on_event("startup")
async def startup_event():
    global predictor
    predictor = GeneratePredictor("./models/generate")


async def run_inference(predictor, generatable, scenario, additional_context):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        executor, predictor.predict, generatable, scenario, additional_context
    )


@app.post("/predict", response_model=GeneratePrediction)
async def predict(
    request: Request,
) -> GeneratePrediction:
    data = await request.json()
    generatable = data.get("generatable", None)
    scenario = data.get("scenario", None)

    if predictor is None:
        raise HTTPException(status_code=500, detail="Predictor not loaded")

    if generatable is None or generatable == "":
        raise HTTPException(status_code=400, detail="No generatable provided")

    if scenario is None or scenario == "":
        raise HTTPException(status_code=400, detail="No scenario provided")

    additional_context = None

    print(
        "\n\nRunning generate prediction on", generatable, scenario, additional_context
    )

    result = await run_inference(predictor, generatable, scenario, additional_context)

    print("\nGot generate prediction", result)

    return result


def start_http_server(host: str = "0.0.0.0", port: int = 6002):
    uvicorn.run(app, host=host, port=port)
