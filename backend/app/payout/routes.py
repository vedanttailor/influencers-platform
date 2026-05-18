# backend/app/payout/routes.py

import os
import uuid
import requests

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db

from app.models import (
    Campaign,
    Payment,
    Payout,
    User
)

router = APIRouter(
    prefix="/payout",
    tags=["Payout"]
)

# =========================================
# RAZORPAY KEYS
# =========================================

RAZORPAY_KEY_ID = os.getenv(
    "RAZORPAY_KEY_ID"
)

RAZORPAY_KEY_SECRET = os.getenv(
    "RAZORPAY_KEY_SECRET"
)

RAZORPAYX_ACCOUNT_NUMBER = os.getenv(
    "RAZORPAYX_ACCOUNT_NUMBER"
)

# =========================================
# ADMIN PAY TO INFLUENCER
# =========================================

@router.post(
    "/pay-influencer/{campaign_id}"
)
def pay_influencer(
    campaign_id: str,
    db: Session = Depends(get_db)
):

    print("\n========== PAYOUT START ==========\n")

    # =========================================
    # FIND CAMPAIGN
    # =========================================

    campaign = db.query(Campaign).filter(
        Campaign.id == campaign_id
    ).first()

    print("CAMPAIGN:", campaign)

    if not campaign:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    # =========================================
    # CHECK CLIENT PAYMENT
    # =========================================

    payment = db.query(Payment).filter(
        Payment.campaign_id == campaign_id,
        Payment.payment_status == "paid"
    ).first()

    print("PAYMENT:", payment)

    if not payment:
        raise HTTPException(
            status_code=400,
            detail="Client payment pending"
        )

    # =========================================
    # CHECK IF ALREADY PAID
    # =========================================

    existing_payout = db.query(Payout).filter(
        Payout.campaign_id == campaign_id,
        Payout.payout_status == "paid"
    ).first()

    print("EXISTING PAYOUT:", existing_payout)

    if existing_payout:
        raise HTTPException(
            status_code=400,
            detail="Influencer already paid"
        )

    # =========================================
    # FIND INFLUENCER
    # =========================================

    influencer = db.query(User).filter(
        User.id == campaign.influencer_id
    ).first()

    print("INFLUENCER:", influencer)

    if not influencer:
        raise HTTPException(
            status_code=404,
            detail="Influencer not found"
        )

    # =========================================
    # CHECK UPI ID
    # =========================================

    print("UPI ID:", influencer.upi_id)

    if not influencer.upi_id:
        raise HTTPException(
            status_code=400,
            detail="Influencer UPI ID missing"
        )

    # =========================================
    # CREATE CONTACT
    # =========================================

    contact_payload = {

        "name":
            influencer.full_name,

        "email":
            influencer.email,

        "contact":
            influencer.phone,

        "type":
            "employee"
    }

    print("\nCONTACT PAYLOAD:")
    print(contact_payload)

    contact_response = requests.post(

        "https://api.razorpay.com/v1/contacts",

        auth=(
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ),

        json=contact_payload
    )

    print("\nCONTACT STATUS:")
    print(contact_response.status_code)

    contact_data = contact_response.json()

    print("\nCONTACT RESPONSE:")
    print(contact_data)

    if "id" not in contact_data:

        raise HTTPException(
            status_code=400,
            detail=str(contact_data)
        )

    contact_id = contact_data["id"]

    # =========================================
    # CREATE FUND ACCOUNT
    # =========================================

    fund_payload = {

        "contact_id":
            contact_id,

        "account_type":
            "vpa",

        "vpa": {
            "address":
                influencer.upi_id
        }
    }

    print("\nFUND ACCOUNT PAYLOAD:")
    print(fund_payload)

    fund_response = requests.post(

        "https://api.razorpay.com/v1/fund_accounts",

        auth=(
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ),

        json=fund_payload
    )

    print("\nFUND STATUS:")
    print(fund_response.status_code)

    fund_data = fund_response.json()

    print("\nFUND RESPONSE:")
    print(fund_data)

    if "id" not in fund_data:

        raise HTTPException(
            status_code=400,
            detail=str(fund_data)
        )

    fund_account_id = fund_data["id"]

    # =========================================
    # CREATE PAYOUT
    # =========================================

    payout_amount = int(
        payment.campaign_amount * 100
    )

    payout_payload = {

        "account_number":
            RAZORPAYX_ACCOUNT_NUMBER,

        "fund_account_id":
            fund_account_id,

        "amount":
            payout_amount,

        "currency":
            "INR",

        "mode":
            "UPI",

        "purpose":
            "payout",

        "queue_if_low_balance":
            True,

        "reference_id":
            str(uuid.uuid4()),

        "narration":
            "Influencer payout"
    }

    print("\nPAYOUT PAYLOAD:")
    print(payout_payload)

    payout_response = requests.post(

        "https://api.razorpay.com/v1/payouts",

        auth=(
            RAZORPAY_KEY_ID,
            RAZORPAY_KEY_SECRET
        ),

        json=payout_payload
    )

    print("\nPAYOUT STATUS:")
    print(payout_response.status_code)

    payout_data = payout_response.json()

    print("\nPAYOUT RESPONSE:")
    print(payout_data)

    if "id" not in payout_data:

        raise HTTPException(
            status_code=400,
            detail=str(payout_data)
        )

    # =========================================
    # SAVE PAYOUT IN DATABASE
    # =========================================

    payout = Payout(

        campaign_id=
            campaign.id,

        payment_id=
            payment.id,

        influencer_id=
            campaign.influencer_id,

        payout_amount=
            payment.campaign_amount,

        payout_method=
            "UPI",

        transaction_id=
            payout_data["id"],

        payout_status=
            "paid"
    )

    db.add(payout)

    db.commit()

    print("\n========== PAYOUT SUCCESS ==========\n")

    # =========================================
    # RESPONSE
    # =========================================

    return {

        "success": True,

        "message":
            "Influencer paid successfully",

        "campaign_amount":
            payment.campaign_amount,

        "platform_fee":
            payment.platform_fee,

        "client_paid":
            payment.total_amount,

        "influencer_received":
            payment.campaign_amount,

        "transaction_id":
            payout_data["id"],

        "upi_id":
            influencer.upi_id
    }


# =========================================
# GET ALL PAYOUTS
# =========================================

@router.get("")
def get_all_payouts(
    db: Session = Depends(get_db)
):

    payouts = db.query(Payout).all()

    data = []

    for payout in payouts:

        data.append({

            "id":
                payout.id,

            "campaign_id":
                str(payout.campaign_id),

            "payment_id":
                payout.payment_id,

            "influencer_id":
                str(payout.influencer_id),

            "payout_amount":
                payout.payout_amount,

            "payout_method":
                payout.payout_method,

            "transaction_id":
                payout.transaction_id,

            "payout_status":
                payout.payout_status,

            "created_at":
                payout.created_at
        })

    return data