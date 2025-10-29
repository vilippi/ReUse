from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, v):
        return ObjectId(v) if not isinstance(v, ObjectId) else v

class UserInDB(BaseModel):
    id: PyObjectId | None = Field(default=None, alias="_id")
    email: EmailStr
    hashed_password: str
    is_active: bool = True

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
