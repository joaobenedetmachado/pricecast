from fastapi import FastAPI, File, UploadFile
import pandas as pd 
from datetime import date, timedelta
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pathlib import Path

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

        return JSONResponse({"files": csv_files})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500) 