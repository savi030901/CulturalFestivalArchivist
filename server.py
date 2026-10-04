from pathlib import Path
import json
import uuid

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


app = FastAPI(title="Cultural Festival Archivist API")


# --------------------------------------------------
# Project folders and files
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploaded_media"
DATA_FILE = BASE_DIR / "festival_uploads.json"

UPLOAD_DIR.mkdir(exist_ok=True)


# --------------------------------------------------
# CORS - Allow React frontend
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Home
# --------------------------------------------------

@app.get("/")
def home():
    return {
        "message": "Cultural Festival Archivist API is running!"
    }


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# --------------------------------------------------
# Get all uploaded festival media
# --------------------------------------------------

@app.get("/uploads")
def get_uploads():

    if not DATA_FILE.exists():
        return []

    try:
        return json.loads(
            DATA_FILE.read_text(
                encoding="utf-8"
            )
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Saved upload data could not be read."
        )


# --------------------------------------------------
# Upload festival media
# --------------------------------------------------

@app.post("/uploads")
async def save_upload(
    festivalName: str = Form(...),
    location: str = Form(...),
    category: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
):

    # Check required fields
    if not festivalName.strip():
        raise HTTPException(
            status_code=400,
            detail="Festival name is required."
        )

    if not location.strip():
        raise HTTPException(
            status_code=400,
            detail="Location is required."
        )


    # Check file type
    allowed_types = ("image/", "video/")

    if not (file.content_type or "").startswith(
        allowed_types
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image or video."
        )


    # Read uploaded file
    content = await file.read()


    # Check empty file
    if not content:
        raise HTTPException(
            status_code=400,
            detail="The selected file is empty."
        )


    # Maximum file size = 50 MB
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Please choose a file smaller than 50 MB."
        )


    # Create unique filename
    original_filename = file.filename or "festival_media"

    extension = Path(
        original_filename
    ).suffix[:15]

    saved_name = (
        f"{uuid.uuid4().hex}{extension}"
    )


    # Save actual image/video
    saved_file = UPLOAD_DIR / saved_name

    saved_file.write_bytes(content)


    # Create upload information
    item = {
        "id": uuid.uuid4().hex,
        "name": festivalName.strip(),
        "location": location.strip(),
        "category": category,
        "description": description.strip(),
        "fileName": original_filename,
        "fileType": file.content_type or "",
        "mediaUrl": f"/media/{saved_name}",
    }


    # Load existing records
    if DATA_FILE.exists():

        try:
            items = json.loads(
                DATA_FILE.read_text(
                    encoding="utf-8"
                )
            )

        except json.JSONDecodeError:

            items = []

    else:

        items = []


    # Add new record
    items.append(item)


    # Save records to JSON file
    DATA_FILE.write_text(
        json.dumps(
            items,
            ensure_ascii=False,
            indent=2
        ),
        encoding="utf-8",
    )


    # Return success response
    return {
        "message": "Festival media saved successfully!",
        "item": item,
    }


# --------------------------------------------------
# Serve uploaded images/videos
# --------------------------------------------------

# Delete an uploaded festival record and its media file
@app.delete("/uploads/{upload_id}")
def delete_upload(upload_id: str):
    if not DATA_FILE.exists():
        raise HTTPException(
            status_code=404,
            detail="Festival record not found."
        )

    try:
        items = json.loads(
            DATA_FILE.read_text(encoding="utf-8")
        )
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Could not read saved festival records."
        )

    item = next(
        (record for record in items if record.get("id") == upload_id),
        None
    )

    if item is None:
        raise HTTPException(
            status_code=404,
            detail="Festival record not found."
        )

    media_url = item.get("mediaUrl", "")
    filename = Path(media_url).name

    if filename:
        media_file = UPLOAD_DIR / filename

        if media_file.exists() and media_file.is_file():
            media_file.unlink()

    items = [
        record for record in items
        if record.get("id") != upload_id
    ]

    DATA_FILE.write_text(
        json.dumps(items, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )

    return {"message": "Festival record deleted successfully."}
app.mount(
    "/media",
    StaticFiles(
        directory=str(UPLOAD_DIR)
    ),
    name="media",
)