"""Mini House Cafe API.

Set MONGO_URL and DB_NAME in .env before running in production.  Requests are
stored in MongoDB when configured; the menu remains available without it.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    mongo_url: str | None = None
    db_name: str = "mini_house_cafe"
    cors_origins: str = "http://localhost:5173"


settings = Settings()
app = FastAPI(title="Mini House Cafe API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

MENU = [
    {"id": "adobo", "category": "Filipino", "name": "Chicken Adobo", "price": 1200, "pickup": True},
    {"id": "curry", "category": "Indian", "name": "Vegetable Curry", "price": 1100, "pickup": True},
    {"id": "tacos", "category": "Tacos", "name": "Taco Plate", "price": 1000, "pickup": True},
    {"id": "barako", "category": "Coffee", "name": "Philippine Barako Coffee", "price": 500, "pickup": True},
    {"id": "beer", "category": "Drinks", "name": "Beer", "price": 600, "pickup": False},
]
RESERVATION_SLOTS = ["08:00", "08:30", "09:00", "11:30", "12:00", "12:30", "17:30", "18:00", "18:30"]


class OrderItem(BaseModel):
    menu_id: str
    quantity: int = Field(ge=1, le=20)


class OrderRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=5, max_length=40)
    pickup_time: str = Field(min_length=1, max_length=40)
    items: list[OrderItem] = Field(min_length=1)
    guest_age: int | None = Field(default=None, ge=0, le=130)


class ReservationRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=5, max_length=40)
    date: str
    time: str
    guests: int = Field(ge=1, le=40)


class EventRequest(BaseModel):
    customer_name: str = Field(min_length=1, max_length=100)
    phone: str = Field(min_length=5, max_length=40)
    date: str
    guests: int = Field(ge=1, le=40)
    event_type: Literal["birthday", "debut", "reunion", "company", "other"]
    live_band: bool = False
    notes: str = Field(default="", max_length=1000)


async def save(collection: str, document: dict) -> None:
    if settings.mongo_url:
        client = AsyncIOMotorClient(settings.mongo_url)
        try:
            await client[settings.db_name][collection].insert_one(document)
        finally:
            client.close()


@app.get("/api/health")
async def health() -> dict:
    return {"status": "ok"}


@app.get("/api/menu")
async def menu() -> dict:
    return {"items": MENU, "reservation_slots": RESERVATION_SLOTS}


@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def create_order(order: OrderRequest) -> dict:
    indexed = {item["id"]: item for item in MENU}
    lines, total = [], 0
    for request_item in order.items:
        item = indexed.get(request_item.menu_id)
        if item is None or not item["pickup"]:
            raise HTTPException(status_code=400, detail="One or more menu items cannot be picked up.")
        line_total = item["price"] * request_item.quantity
        total += line_total
        lines.append({"menu_id": item["id"], "name": item["name"], "quantity": request_item.quantity, "line_total": line_total})
    coffee_discount = 0
    if order.guest_age is not None and order.guest_age >= 65:
        coffee_discount = sum(line["line_total"] for line in lines if line["menu_id"] == "barako")
        total -= coffee_discount
    record = {"customer_name": order.customer_name, "phone": order.phone, "pickup_time": order.pickup_time, "items": lines, "total": total, "coffee_discount": coffee_discount, "created_at": datetime.now(timezone.utc)}
    await save("orders", record)
    return {"message": "Order received. Please pay at the counter.", "total": total, "coffee_discount": coffee_discount}


@app.post("/api/reservations", status_code=status.HTTP_201_CREATED)
async def create_reservation(reservation: ReservationRequest) -> dict:
    if reservation.time not in RESERVATION_SLOTS:
        raise HTTPException(status_code=400, detail="Please select an available reservation time.")
    record = reservation.model_dump() | {"created_at": datetime.now(timezone.utc)}
    await save("reservations", record)
    return {"message": "Reservation request received. We will confirm it shortly."}


@app.post("/api/events", status_code=status.HTTP_201_CREATED)
async def create_event(event: EventRequest) -> dict:
    record = event.model_dump() | {"created_at": datetime.now(timezone.utc)}
    await save("events", record)
    return {"message": "Event request received. We will contact you shortly."}
