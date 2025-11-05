from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.database import engine, Base
from api.routes import auth, announcements, general

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Campus Lost/Found MTUCI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    from sqlalchemy.orm import sessionmaker
    from api.models import UserDB, AnnouncementDB
    from api.auth import get_password_hash

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    try:
        admin = db.query(UserDB).filter(UserDB.username == "admin").first()
        if not admin:
            admin = UserDB(
                username="admin",
                email="admin@mtuci.ru",
                password_hash=get_password_hash("admin123"),
                role="admin"
            )
            db.add(admin)
            db.commit()

        if db.query(AnnouncementDB).count() == 0:
            announcement1 = AnnouncementDB(
                type="Пропал",
                category="Электроника",
                description="Чёрный ноутбук",
                location_lat="55.7557",
                location_lng="37.71174",
                user_id=admin.id
            )
            announcement2 = AnnouncementDB(
                type="Найден",
                category="Ключи",
                description="Серебряный брелок",
                location_lat="55.75566",
                location_lng="37.71494",
                user_id=admin.id
            )
            db.add(announcement1)
            db.add(announcement2)
            db.commit()

    finally:
        db.close()

app.include_router(general.router, tags=["general"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(announcements.router, prefix="/api", tags=["announcements"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8002)