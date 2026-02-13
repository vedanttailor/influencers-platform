import enum
from sqlalchemy import Column, String, Enum, DateTime # type: ignore
from sqlalchemy.dialects.postgresql import UUID # type: ignore
from datetime import datetime
import uuid
from .database import Base

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
