from fastapi import FastAPI, HTTPException, Depends # type: ignore
from app.auth.routes import router as auth_router
from app.auth.dependencies import get_current_user
from app.database import Base, engine
from app.auth.permissions import require_role
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from app.campaigns.routes import router as campaign_router
from app.responses.routes import router as responses_router
from app.influencer.routes import router as influencer_router
from app.admin.routes import router as admin_router
from app.manager.routes import router as manager_router
from app.core.cloudinary import cloudinary
from app.payment.routes import router as payment_router
from app.payout.routes import router as payout_router
from app.youtube.routes import router as youtube_router
from app.notification.routes import router as notification_router



app = FastAPI()
Base.metadata.create_all(engine)

app.include_router(auth_router)
app.include_router(campaign_router)
app.include_router(responses_router)
app.include_router(influencer_router)
app.include_router(admin_router)
app.include_router(manager_router)
app.include_router(youtube_router)
app.include_router(notification_router)
app.include_router(
    payment_router,
    prefix="/payment",
    tags=["Payment"]
)
app.include_router(payout_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "ok"}