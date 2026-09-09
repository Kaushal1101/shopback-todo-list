from typing import Optional
from datetime import date
from pydantic import BaseModel, field_validator, model_validator


class TaskCreate(BaseModel):
    title: str
    deadline: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("title must not be empty")
        if not any(c.isalnum() for c in v):
            raise ValueError("title must contain at least one letter or number")
        return v.strip()

    @field_validator("deadline")
    @classmethod
    def deadline_must_be_valid_date(cls, v):
        if v is None:
            return v
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError("deadline must be a valid date in YYYY-MM-DD format")
        return v


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    deadline: Optional[str] = None

    @field_validator("title")
    @classmethod
    def title_must_not_be_empty(cls, v):
        if v is None:
            return v
        if not v.strip():
            raise ValueError("title must not be empty")
        if not any(c.isalnum() for c in v):
            raise ValueError("title must contain at least one letter or number")
        return v.strip()

    @field_validator("deadline")
    @classmethod
    def deadline_must_be_valid_date(cls, v):
        if v is None:
            return v
        try:
            date.fromisoformat(v)
        except ValueError:
            raise ValueError("deadline must be a valid date in YYYY-MM-DD format")
        return v

    @model_validator(mode="after")
    def non_nullable_fields_cannot_be_null(self):
        if "title" in self.model_fields_set and self.title is None:
            raise ValueError("title cannot be null")
        if "completed" in self.model_fields_set and self.completed is None:
            raise ValueError("completed cannot be null")
        return self


class TaskResponse(BaseModel):
    id: int
    title: str
    completed: bool
    deadline: Optional[str] = None
