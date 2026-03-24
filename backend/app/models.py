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
    email = Column(String, unique=True, index=True)
    password = Column(String)

    phone = Column(String(15), nullable=True)
    profile_img = Column(String, nullable=True)

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


class Influencer(Base):
    __tablename__ = "influencers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    name = Column(String)
    followers = Column(Integer)
    category = Column(String)

    profile_link = Column(String)

    earnings = Column(Integer, default=0)
    
    
class Client(Base):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    client_name = Column(String)
    email = Column(String)
    company = Column(String)

    product_logo = Column(String)

    influencer_response = Column(String)
    profile_link = Column(String)

    report = Column(String)

    budget = Column(Integer)
    
    
    
class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    title = Column(String)
    description = Column(String)

    platform = Column(String)

    budget = Column(Integer)
    status = Column(String)

    starting_date = Column(DateTime, default=datetime.utcnow)
    ending_date = Column(DateTime)

    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"))
    assigned_manager_id = Column(UUID(as_uuid=True), ForeignKey("managers.id"), nullable=True)
    
    
class Manager(Base):
    __tablename__ = "managers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    department = Column(String)

    is_active = Column(String, default="active")

    created_at = Column(DateTime, default=datetime.utcnow)
    