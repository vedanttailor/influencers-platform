import os

from fastapi import APIRouter # type: ignore
from fastapi.responses import RedirectResponse # type: ignore

from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build

router = APIRouter(
    prefix="/youtube",
    tags=["YouTube"]
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly"
]

# =========================================
# STEP 1: LOGIN WITH GOOGLE
# =========================================

@router.get("/login")
def youtube_login():

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_REDIRECT_URI],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES
    )

    flow.redirect_uri = GOOGLE_REDIRECT_URI

    authorization_url, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true"
    )

    return RedirectResponse(authorization_url)

# =========================================
# STEP 2: CALLBACK
# =========================================

@router.get("/callback")
def youtube_callback(code: str):

    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": GOOGLE_CLIENT_ID,
                "client_secret": GOOGLE_CLIENT_SECRET,
                "redirect_uris": [GOOGLE_REDIRECT_URI],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES
    )

    flow.redirect_uri = GOOGLE_REDIRECT_URI

    flow.fetch_token(code=code)

    credentials = flow.credentials

    youtube = build(
        "youtube",
        "v3",
        credentials=credentials
    )

    request = youtube.channels().list(
        part="snippet,statistics",
        mine=True
    )

    response = request.execute()

    return {
        "success": True,
        "channel_data": response
    }