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
    # OPTIONAL:
    # CREATE CONTACT (FOR DEMO PURPOSE)
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

    try:

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

        print("\nCONTACT RESPONSE:")
        print(contact_response.json())

    except Exception as e:

        print("\nCONTACT ERROR:")
        print(str(e))

    # =========================================
    # OPTIONAL:
    # CREATE FUND ACCOUNT (FOR DEMO PURPOSE)
    # =========================================

    try:

        fund_payload = {

            "contact_id":
                "demo_contact",

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

        print("\nFUND RESPONSE:")
        print(fund_response.json())

    except Exception as e:

        print("\nFUND ACCOUNT ERROR:")
        print(str(e))

    # =========================================
    # SIMULATED PAYOUT
    # =========================================

    payout_amount = payment.campaign_amount

    print("\n========== SIMULATED PAYOUT ==========\n")

    payout_data = {

        "id":
            f"payout_{uuid.uuid4()}",

        "status":
            "processed"
    }

    print("SIMULATED PAYOUT RESPONSE:")
    print(payout_data)

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
            payout_amount,

        payout_method=
            "UPI",

        transaction_id=
            payout_data["id"],

        payout_status=
            "paid"
    )

    db.add(payout)

    # =========================================
    # UPDATE CAMPAIGN STATUS
    # =========================================

    campaign.status = "completed"

    db.commit()

    print("\n========== PAYOUT SUCCESS ==========\n")

    # =========================================
    # RESPONSE
    # =========================================

    return {

        "success": True,

        "message":
            "Influencer paid successfully (Simulated)",

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