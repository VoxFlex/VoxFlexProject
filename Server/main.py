from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.video_routes import router as video_router
from app.api.routes.rvc_routes import router as rvc_router

app = FastAPI(debug=True)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(video_router, prefix="/video", tags=["Video Processing"])
app.include_router(rvc_router, prefix="/rvc", tags=["Voice Changer"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Video Processing API"}
