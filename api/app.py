from fastapi import FastAPI, File, UploadFile
import pandas as pd 
from datetime import date, timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path
from models.main import predict_directive
from scraper.logger import log
from scraper.main import update
import uuid
import shutil
from fastapi import HTTPException

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
        log("Data available: " + str(csv_files))
        return JSONResponse({"files": csv_files}, status_code=200)
    except Exception as e:
        log("Error: " + str(e))
        return JSONResponse({"error": str(e)}, status_code=500) 


@app.post("/predict")
async def predict(csv_path: str, days: int, window_size: int, model: str):
    try:
        if model == "lstm":
            result = predict_directive(csv_path, days, window_size)
            log("Prediction result: " + str(result))
            return JSONResponse({"result": result}, status_code=200)
        else:
            return JSONResponse({"error": "Model not found"}, status_code=404)
    except Exception as e:
        log("Error: " + str(e))
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only .csv files are allowed")

        save_dir = Path("/home/joao/pricecast/scraper/data/")
        save_dir.mkdir(parents=True, exist_ok=True)

        unique_name = f"{uuid.uuid4()}_{file.filename}"
        save_path = save_dir / unique_name

        with save_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        log("File uploaded successfully: " + str(save_path))
        return JSONResponse({
            "message": "File uploaded successfully",
            "filename": unique_name,
            "path": str(save_path)
        })
    except Exception as e:
        log("Error: " + str(e))
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/update")
def update_coin(name: str, part: str):
    try:
        update(name, part)
        log("File updated successfully: " + str(name) + " " + str(part))
        return JSONResponse({"message": "File updated successfully"}, status_code=200)

    except Exception as e:
        log("Error: " + str(e))
        return JSONResponse({"error": str(e)}, status_code=500)

