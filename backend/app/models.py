from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum # type: ignore
from sqlalchemy.sql import func # type: ignore
from sqlalchemy.dialects.postgresql import UUID # type: ignore
import uuid
from datetime import datetime
from app.database import Base
import enum


class UserRole(str, enum.Enum):
    client = "client"
    influencer = "influencer"
    admin = "admin"
    manager = "manager"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(Enum(UserRole))
    full_name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    status = Column(String, default="active")
    is_deleted = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)


class ResetToken(Base):
    __tablename__ = "reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    