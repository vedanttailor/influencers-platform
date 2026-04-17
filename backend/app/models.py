from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text, Numeric, ARRAY # type: ignore
from sqlalchemy.sql import func # type: ignore
from sqlalchemy.dialects.postgresql import UUID, JSONB # type: ignore
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

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    name = Column(String)

    # profile details (better than separate fields)
    profile = Column(JSONB)
    """
    {
        followers_count,
        engagement_rate,
        avg_like,
        avg_comment,
        profile_url
    }
    """

    category = Column(String)

    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True)

    campaign_details = Column(JSONB)

    earnings = Column(JSONB)
    """
    {
        total_earning,
        pending_earning,
        per_campaign_earning
    }
    """


class Client(Base):
    __tablename__ = "clients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    client_name = Column(String)
    company_name = Column(String)

    product_logo = Column(String)

    influencer_response = Column(JSONB)
    """
    [
        {
            influencer_name,
            platform,
            campaign_name,
            deliverables,
            price,
            status,
            action
        }
    ]
    """

    report = Column(JSONB)


class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    campaign_name = Column(String)
    brand_name = Column(String)

    campaign_type = Column(String)
    campaign_category = Column(String)
    campaign_objective = Column(Text)

    platforms = Column(ARRAY(String))  # ["instagram", "youtube"]

    logo = Column(String)
    description = Column(Text)

    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime)

    
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    influencer_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    manager_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    budget = Column(Numeric)

    post_url = Column(String)

    posted_video_data = Column(JSONB)

    status = Column(String, default="pending")

    created_at = Column(DateTime, default=datetime.utcnow)


class Manager(Base):
    __tablename__ = "managers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"), nullable=True)

    image = Column(String)

    approval_status = Column(String)  # approved / rejected / pending
    status = Column(String, default="active")

    client_info = Column(JSONB)
    """
    {
        name,
        email
    }
    """

    influencer_info = Column(JSONB)
    """
    {
        name,
        email,
        platform
    }
    """

    created_at = Column(DateTime, default=datetime.utcnow)
    
class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey("campaigns.id"))  
    influencer_name = Column(String)
    platforms = Column(ARRAY(String))
    campaign_name = Column(String)
    deliverables = Column(String)
    price = Column(String)
    status = Column(String, default="Pending")
    client_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))