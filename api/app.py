from fastapi import FastAPI, File, UploadFile
import pandas as pd 
from datetime import date, timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from models.main import predict_directive

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/data-avaiable")
async def data_avaiable():
    try:
        local = "/home/joao/pricecast/scraper/data/"
        path = Path(local)
        csv_files = [str(f.resolve()) for f in path.glob("*.csv")]

        return JSONResponse({"files": csv_files}, status_code=200)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500) 


@app.post("/predict")
async def predict(csv_path: str, days: int, window_size: int, model: str):
    try:
        if model == "lstm":
            result = predict_directive(csv_path, days, window_size)
            return JSONResponse({"result": result}, status_code=200)
        else:
            return JSONResponse({"error": "Model not found"}, status_code=404)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
