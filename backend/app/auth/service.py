import random
from datetime import datetime, timedelta
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.utils import send_email
from app.models import User, ResetToken


def forgot_password(email: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(404, "User not found")

    db.query(ResetToken).filter(
        ResetToken.user_id == user.id
    ).delete()

    db.commit()

    code = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=5)

    token = ResetToken(
        user_id=user.id,
        token=code,
        expires_at=expires
    )

    db.add(token)
    db.commit()

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:40px;">

                    <table width="600" style="background:#fff;border-radius:12px;overflow:hidden;">

                        <tr>
                            <td style="background:#dc2626;padding:30px;text-align:center;color:white;">
                                <h1>Password Reset Request</h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:40px;color:#333;">

                                <h2>Hello,</h2>

                                <p>
                                    We received a request to reset your password
                                    for your Influencer CRM account.
                                </p>

                                <div style="
                                    text-align:center;
                                    background:#fef2f2;
                                    border:2px dashed #dc2626;
                                    padding:20px;
                                    margin:25px 0;
                                    border-radius:8px;
                                ">
                                    <h1 style="
                                        margin:0;
                                        color:#dc2626;
                                        letter-spacing:8px;
                                    ">
                                        {code}
                                    </h1>
                                </div>

                                <p>
                                    This code is valid for <b>5 minutes</b>.
                                </p>

                                <p>
                                    If you did not request this password reset,
                                    simply ignore this email.
                                </p>

                                <p>
                                    For security reasons, never share this code.
                                </p>

                                <p>
                                    Regards,<br>
                                    <b>Influencer CRM Team</b>
                                </p>

                            </td>
                        </tr>

                        <tr>
                            <td style="
                                background:#f3f4f6;
                                text-align:center;
                                padding:15px;
                                font-size:12px;
                                color:#666;
                            ">
                                © 2026 Influencer CRM. All Rights Reserved.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>
    </body>
    </html>
    """

    send_email(
        to=email,
        subject="Influencer CRM - Password Reset Code",
        html_body=html_body
    )

    return {"message": "Reset code sent successfully"}


def reset_password(email: str, code: str, new_password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(404, "User not found")

    token = db.query(ResetToken).filter(
        ResetToken.user_id == user.id,
        ResetToken.token == code
    ).first()

    if not token:
        raise HTTPException(400, "Invalid code")

    if token.expires_at < datetime.utcnow():
        db.delete(token)
        db.commit()
        raise HTTPException(400, "Code expired")

    user.password = hash_password(new_password)

    db.delete(token)
    db.commit()

    return {"message": "Password updated successfully"}


def send_welcome_email(user):

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding:40px;">

                    <table width="650" style="
                        background:#ffffff;
                        border-radius:12px;
                        overflow:hidden;
                        box-shadow:0 2px 10px rgba(0,0,0,0.1);
                    ">

                        <!-- Header -->
                        <tr>
                            <td style="
                                background:#2563eb;
                                padding:35px;
                                text-align:center;
                                color:white;
                            ">
                                <h1 style="margin:0;">
                                     Welcome to Influencer CRM
                                </h1>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding:40px;color:#333;line-height:1.8;">

                                <h2>Hello {user.full_name},</h2>

                                <p>
                                    Welcome to <b>Influencer CRM</b>.
                                    We’re excited to have you join our growing
                                    creator and brand community.
                                </p>

                                <p>
                                    Your account has been created successfully
                                    and is currently awaiting admin approval.
                                </p>

                                <div style="
                                    background:#f8fafc;
                                    border-left:4px solid #2563eb;
                                    padding:20px;
                                    margin:25px 0;
                                    border-radius:8px;
                                ">
                                    <h3 style="margin-top:0;">
                                         What You Can Do Next
                                    </h3>

                                    <ul>
                                        <li>Complete your profile</li>
                                        <li>Explore active campaigns</li>
                                        <li>Connect with brands & influencers</li>
                                        <li>Track performance analytics</li>
                                        <li>Manage payments & payouts</li>
                                    </ul>
                                </div>

                                <p>
                                    Our platform is designed to help you
                                    collaborate efficiently, manage campaigns,
                                    and grow your digital presence.
                                </p>

                                <p>
                                    If you have any questions, our support team
                                    is always ready to assist you.
                                </p>

                                <p>
                                    Thank you for choosing Influencer CRM.
                                </p>

                                <p>
                                    Best Regards,<br>
                                    <strong>Influencer CRM Team</strong>
                                </p>

                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="
                                background:#f3f4f6;
                                text-align:center;
                                padding:20px;
                                color:#666;
                                font-size:12px;
                            ">
                                © 2026 Influencer CRM. All Rights Reserved.
                                <br>
                                Empowering Brands & Influencers Worldwide.
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    """

    send_email(
        to=user.email,
        subject="🎉 Welcome to Influencer CRM",
        html_body=html_body
    )