from pydantic import BaseModel, EmailStr, field_validator

class Register(BaseModel):
    hospital_name: str
    email: EmailStr
    contact: str
    name: str
    address: str
    username: str
    password: str
    
    @field_validator('password')
    @classmethod
    def truncate_password(cls, v):
        # Bcrypt has a 72-byte limit, truncate password if necessary
        password_bytes = v.encode('utf-8')
        if len(password_bytes) > 72:
            v = password_bytes[:72].decode('utf-8', errors='ignore')
        return v

class Login(BaseModel):
    username: str
    password: str

class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str
    contact: str = ""
    address: str = ""
    patient_custom_id: str = ""
    hospital_username: str

class PatientResponse(BaseModel):
    id: int
    patient_custom_id: str | None = None
    name: str
    age: int
    gender: str
    contact: str | None = None
    address: str | None = None
    hospital_id: int

    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    id: int
    patient_id: int
    hospital_id: int
    patient_name: str | None = None
    tumor_type: str
    pdf_path: str
    created_at: str

    class Config:
        from_attributes = True

class PatientWithReportsResponse(PatientResponse):
    reports: list[ReportResponse] = []

    class Config:
        from_attributes = True

