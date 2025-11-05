from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="user", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AnnouncementDB(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String(20), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    location_lat = Column(String(20))
    location_lng = Column(String(20))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, nullable=False)