from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
    return {
        "message": "Campus Lost/Found MTUCI API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health",
            "announcements": "GET /api/announcements",
            "create_announcement": "POST /api/announcements",
            "announcement_detail": "GET /api/announcements/{id}",
            "search": "GET /api/search?q={query}",
            "register": "POST /api/auth/register",
            "login": "POST /api/auth/login"
        }
    }

@router.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running"}