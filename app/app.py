
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import shutil
import uuid


# --------------------------------------------------
# APP
# --------------------------------------------------

app = FastAPI(
    title="Cultural Festival Archivist API"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://culturalfestivalarchivist-1.onrender.com",
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# DIRECTORIES
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_DIR = BASE_DIR / "uploads"
DATA_DIR = BASE_DIR / "data"
DATA_FILE = DATA_DIR / "media_records.json"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# DATA HELPERS
# --------------------------------------------------

def load_records():
    if not DATA_FILE.exists():
        return []

    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, list):
            return data

        return []

    except Exception:
        return []


def save_records(records):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)


# --------------------------------------------------
# STATIC UPLOAD FILES
# --------------------------------------------------

app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads"
)
app.mount(
    "/media",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="media"
)

# --------------------------------------------------
# ROOT
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Cultural Festival Archivist API"
    }


# --------------------------------------------------
# HEALTH
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "ok",
        "message": "Cultural Festival Archivist API"
    }


# --------------------------------------------------
# GET ALL UPLOADS
# --------------------------------------------------

@app.get("/uploads")
def get_uploads():
    records = load_records()
    return records


# --------------------------------------------------
# POST UPLOAD
# --------------------------------------------------

@app.post("/uploads")
async def save_upload(
    festivalName: str = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...)
):

    # Validate file type
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type."
        )

    if not (
        file.content_type.startswith("image/")
        or file.content_type.startswith("video/")
    ):
        raise HTTPException(
            status_code=400,
            detail="Only image and video files are allowed."
        )

    # Create unique file name
    extension = Path(file.filename).suffix
    unique_name = f"{uuid.uuid4().hex}{extension}"

    file_path = UPLOAD_DIR / unique_name

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not save file: {str(e)}"
        )

    # Create record
    upload_id = uuid.uuid4().hex

    record = {
        "id": upload_id,
        "name": festivalName.strip(),
        "festivalName": festivalName.strip(),
        "category": category.strip(),
        "location": location.strip(),
        "description": description.strip(),
        "fileName": file.filename,
        "fileType": file.content_type,
        "mediaUrl": f"/uploads/{unique_name}"
    }

    # Save record
    records = load_records()
    records.insert(0, record)
    save_records(records)

    return {
        "message": "Festival media saved successfully!",
        "item": record
    }


# --------------------------------------------------
# DELETE UPLOAD
# --------------------------------------------------

@app.delete("/uploads/{upload_id}")
def delete_upload(upload_id: str):

    records = load_records()

    record = next(
        (item for item in records if item.get("id") == upload_id),
        None
    )

    if record is None:
        raise HTTPException(
            status_code=404,
            detail="Upload not found."
        )

    # Delete physical file
    media_url = record.get("mediaUrl", "")

    if media_url.startswith("/uploads/"):
        filename = media_url.replace("/uploads/", "", 1)
        file_path = UPLOAD_DIR / filename

        if file_path.exists():
            try:
                file_path.unlink()
            except Exception:
                pass

    # Remove record
    records = [
        item for item in records
        if item.get("id") != upload_id
    ]

    save_records(records)

    return {
        "message": "Upload deleted successfully."
    }


# --------------------------------------------------
# STATISTICS
# --------------------------------------------------

@app.get("/statistics")
def statistics():

    records = load_records()

    total = len(records)

    categories = {}

    for item in records:
        category = item.get("category", "Unknown")

        categories[category] = categories.get(category, 0) + 1

    return {
        "totalUploads": total,
        "categories": categories
    }

