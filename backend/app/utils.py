import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv # type: ignore

load_dotenv()

def send_email(to, subject, body):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = os.getenv("influencercrm63@gmail.com")
    msg["To"] = to
    msg.set_content(body)

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login(
         os.getenv("EMAIL_USER"),           
        os.getenv("EMAIL_PASSWORD")
    )
    server.send_message(msg)
    server.quit()