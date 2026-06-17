import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()


def send_email(to, subject, html_body):
    msg = EmailMessage()

    msg["Subject"] = subject
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to

    # Fallback plain text
    msg.set_content(
        "Please open this email in an HTML compatible email client."
    )

    # HTML Email
    msg.add_alternative(
        html_body,
        subtype="html"
    )

    server = smtplib.SMTP_SSL(
        "smtp.gmail.com",
        465
    )

    server.login(
        os.getenv("EMAIL_USER"),
        os.getenv("EMAIL_PASSWORD")
    )

    server.send_message(msg)
    server.quit()