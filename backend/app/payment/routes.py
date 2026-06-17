import os
import hmac
import hashlib
import razorpay # type: ignore

from fastapi import APIRouter, Depends, HTTPException # type: ignore
from sqlalchemy.orm import Session # type: ignore
from dotenv import load_dotenv # type: ignore

from app.database import get_db
from app.models import Campaign, Payment

load_dotenv()

router = APIRouter()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

PLATFORM_FEE_PERCENT = 10


# ======================================
# CREATE ORDER
# ======================================

@router.post("/create-order/{campaign_id}")
def create_order(
    campaign_id: str,
    db: Session = Depends(get_db)
):

    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id
    ).first()

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    # ======================================
    # CHECK IF PAYMENT ALREADY DONE
    # ======================================

    existing_payment = db.query(Payment).filter(
        Payment.campaign_id == campaign_id,
        Payment.payment_status == "paid"
    ).first()

    if existing_payment:
        raise HTTPException(
            status_code=400,
            detail="Payment already completed"
        )

    campaign_amount = float(campaign.budget)

    platform_fee = (
        campaign_amount * PLATFORM_FEE_PERCENT
    ) / 100

    total_amount = campaign_amount + platform_fee

    razorpay_order = client.order.create({
        "amount": int(total_amount * 100),
        "currency": "INR",
        "payment_capture": 1
    })

    payment = Payment(
        campaign_id=campaign.id,
        client_id=campaign.client_id,
        influencer_id=campaign.influencer_id,

        campaign_amount=campaign_amount,
        platform_fee=platform_fee,
        total_amount=total_amount,

        razorpay_order_id=razorpay_order["id"],
        payment_status="pending"
    )

    db.add(payment)
    db.commit()

    return {
        "success": True,
        "key": RAZORPAY_KEY_ID,
        "order_id": razorpay_order["id"],
        "campaign_amount": campaign_amount,
        "platform_fee": platform_fee,
        "total_amount": total_amount
    }


# ======================================
# VERIFY PAYMENT
# ======================================

@router.post("/verify-payment")
def verify_payment(
    data: dict,
    db: Session = Depends(get_db)
):

    razorpay_order_id = data["razorpay_order_id"]
    razorpay_payment_id = data["razorpay_payment_id"]
    razorpay_signature = data["razorpay_signature"]

    generated_signature = hmac.new(
        bytes(RAZORPAY_KEY_SECRET, "utf-8"),
        bytes(
            razorpay_order_id + "|" + razorpay_payment_id,
            "utf-8"
        ),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != razorpay_signature:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment signature"
        )

    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == razorpay_order_id
    ).first()

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment record not found"
        )

    payment.razorpay_payment_id = razorpay_payment_id
    payment.razorpay_signature = razorpay_signature
    payment.payment_status = "paid"

    campaign = db.query(Campaign).filter(
        Campaign.id == payment.campaign_id
    ).first()

    if campaign:
        campaign.status = "completed"

    db.commit()

    return {
        "success": True,
        "message": "Payment verified successfully"
    }