from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, validator
from sqlalchemy.orm import Session
from typing import List, Optional
import datetime
from ..database import get_db
from ..models import AnnouncementDB, UserDB
from ..auth import get_current_user

router = APIRouter()

class AnnouncementBase(BaseModel):
    type: str
    category: str
    description: str
    location: Optional[List[float]] = None

    @validator('type')
    def type_must_be_valid(cls, v):
        if v not in ['Пропал', 'Найден']:
            raise ValueError('Тип объявления должен быть "Пропал" или "Найден"')
        return v

    @validator('category')
    def category_must_be_valid(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Категория обязательна')
        if len(v) > 50:
            raise ValueError('Категория не должна превышать 50 символов')
        return v.strip()

    @validator('description')
    def description_must_be_valid(cls, v):
        if len(v.strip()) == 0:
            raise ValueError('Описание обязательно')
        if len(v) > 500:
            raise ValueError('Описание не должно превышать 500 символов')
        return v.strip()

class AnnouncementCreate(AnnouncementBase):
    pass

class Announcement(AnnouncementBase):
    id: int
    created_at: datetime.datetime
    user_id: int

@router.get("/")
def get_announcements(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    announcements = db.query(AnnouncementDB).offset(skip).limit(limit).all()
    total = db.query(AnnouncementDB).count()

    result = []
    for ann in announcements:
        result.append({
            "id": ann.id,
            "type": ann.type,
            "Категория": ann.category,
            "Описание": ann.description,
            "Локация": [ann.location_lat, ann.location_lng] if ann.location_lat and ann.location_lng else [],
            "created_at": ann.created_at.isoformat() + "Z" if ann.created_at else None,
            "user_id": ann.user_id
        })

    return {"announcements": result, "total": total, "skip": skip, "limit": limit}

@router.post("/", response_model=Announcement)
def create_announcement(
    announcement: AnnouncementCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_announcement = AnnouncementDB(
        type=announcement.type,
        category=announcement.category,
        description=announcement.description,
        location_lat=str(announcement.location[0]) if announcement.location and len(announcement.location) >= 1 else None,
        location_lng=str(announcement.location[1]) if announcement.location and len(announcement.location) >= 2 else None,
        user_id=current_user.id
    )

    db.add(db_announcement)
    db.commit()
    db.refresh(db_announcement)

    return {
        "id": db_announcement.id,
        "type": db_announcement.type,
        "category": db_announcement.category,
        "description": db_announcement.description,
        "location": [db_announcement.location_lat, db_announcement.location_lng] if db_announcement.location_lat and db_announcement.location_lng else [],
        "created_at": db_announcement.created_at,
        "user_id": db_announcement.user_id
    }

@router.get("/{announcement_id}", response_model=Announcement)
def get_announcement(announcement_id: int, db: Session = Depends(get_db)):
    announcement = db.query(AnnouncementDB).filter(AnnouncementDB.id == announcement_id).first()
    if not announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    return {
        "id": announcement.id,
        "type": announcement.type,
        "category": announcement.category,
        "description": announcement.description,
        "location": [announcement.location_lat, announcement.location_lng] if announcement.location_lat and announcement.location_lng else [],
        "created_at": announcement.created_at,
        "user_id": announcement.user_id
    }

@router.put("/{announcement_id}", response_model=Announcement)
def update_announcement(
    announcement_id: int,
    announcement: AnnouncementCreate,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_announcement = db.query(AnnouncementDB).filter(AnnouncementDB.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    if db_announcement.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db_announcement.type = announcement.type
    db_announcement.category = announcement.category
    db_announcement.description = announcement.description
    if announcement.location and len(announcement.location) >= 2:
        db_announcement.location_lat = str(announcement.location[0])
        db_announcement.location_lng = str(announcement.location[1])

    db.commit()
    db.refresh(db_announcement)

    return {
        "id": db_announcement.id,
        "type": db_announcement.type,
        "category": db_announcement.category,
        "description": db_announcement.description,
        "location": [db_announcement.location_lat, db_announcement.location_lng] if db_announcement.location_lat and db_announcement.location_lng else [],
        "created_at": db_announcement.created_at,
        "user_id": db_announcement.user_id
    }

@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: int,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_announcement = db.query(AnnouncementDB).filter(AnnouncementDB.id == announcement_id).first()
    if not db_announcement:
        raise HTTPException(status_code=404, detail="Announcement not found")

    if db_announcement.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(db_announcement)
    db.commit()

    return {"message": "Announcement deleted successfully"}

@router.get("/search/")
def search_announcements(
    q: Optional[str] = None,
    category: Optional[str] = None,
    type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AnnouncementDB)

    if q:
        query = query.filter(
            (AnnouncementDB.description.ilike(f"%{q}%")) |
            (AnnouncementDB.category.ilike(f"%{q}%"))
        )

    if category:
        query = query.filter(AnnouncementDB.category.ilike(f"%{category}%"))

    if type:
        query = query.filter(AnnouncementDB.type == type)

    announcements = query.all()

    result = []
    for ann in announcements:
        result.append({
            "id": ann.id,
            "type": ann.type,
            "Категория": ann.category,
            "Описание": ann.description,
            "Локация": [ann.location_lat, ann.location_lng] if ann.location_lat and ann.location_lng else [],
            "created_at": ann.created_at.isoformat() + "Z" if ann.created_at else None,
            "user_id": ann.user_id
        })

    return result