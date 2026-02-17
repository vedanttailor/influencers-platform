import smtplib
from email.message import EmailMessage

def send_email(to, subject, body):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = "your@gmail.com"
    msg["To"] = to
    msg.set_content(body)

    server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
    server.login("your@gmail.com", "APP_PASSWORD")
    server.send_message(msg)
    server.quit()
