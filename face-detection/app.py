from fastapi import FastAPI, File, UploadFile, Form, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
import face_recognition
import requests
from datetime import datetime
import io
import base64
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_URL = "http://backend:4000/events/face-detection"  

def get_utc_iso_timestamp():
    return datetime.utcnow().replace(microsecond=0).isoformat() + 'Z'

@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            try:
                msg = json.loads(data)
                sessionId = msg.get("sessionId")
                image_b64 = msg.get("image")
                if not sessionId or not image_b64:
                    await websocket.send_json({"error": "Missing sessionId or image"})
                    continue
                image_bytes = base64.b64decode(image_b64)
                nparr = np.frombuffer(image_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                face_locations = face_recognition.face_locations(rgb_img)
                num_faces = len(face_locations)
                timestamp = get_utc_iso_timestamp()
                # Optionally encode snapshot as base64 (not implemented here)
                snapshot = None
                if num_faces != 1:
                    try:
                        requests.post(BACKEND_URL, json={
                            "sessionId": sessionId,
                            "numFaces": num_faces,
                            "timestamp": timestamp,
                            "snapshot": snapshot
                        })
                        print(f"Sent face event: {num_faces} faces for session {sessionId} at {timestamp}")
                    except Exception as e:
                        print(f"Failed to send event to backend: {e}")
                await websocket.send_json({
                    "timestamp": timestamp,
                    "numFaces": num_faces,
                    "faces": face_locations
                })
            except Exception as e:
                await websocket.send_json({"error": str(e)})
    except WebSocketDisconnect:
        print("WebSocket disconnected")

@app.post("/detect")
async def detect_faces(
    sessionId: str = Form(...),
    file: UploadFile = File(...)
):
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_img)
    num_faces = len(face_locations)
    timestamp = get_utc_iso_timestamp()
    snapshot = None
    if num_faces != 1:
        try:
            requests.post(BACKEND_URL, json={
                "sessionId": sessionId,
                "numFaces": num_faces,
                "timestamp": timestamp,
                "snapshot": snapshot
            })
            print(f"Sent face event: {num_faces} faces for session {sessionId} at {timestamp}")
        except Exception as e:
            print(f"Failed to send event to backend: {e}")
    return JSONResponse({
        "timestamp": timestamp,
        "numFaces": num_faces,
        "faces": face_locations
    })

@app.get("/")
def root():
    return {"status": "Face Detection Service running"} 