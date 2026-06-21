from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    hospital_name = Column(String)
    email = Column(String, unique=True)
    contact = Column(String)
    name = Column(String)
    address = Column(String)
    username = Column(String, unique=True)
    password = Column(String)
    is_main_hospital_user = Column(Integer, default=0)
    main_hospital_user_id = Column(Integer, nullable=True)

    patients = relationship("Patient", back_populates="hospital")
    reports = relationship("Report", back_populates="hospital")

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    patient_custom_id = Column(String, nullable=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    address = Column(String, nullable=True)
    hospital_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    hospital = relationship("User", back_populates="patients")
    reports = relationship("Report", back_populates="patient", cascade="all, delete-orphan")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    hospital_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    patient_name = Column(String, nullable=True)
    tumor_type = Column(String, nullable=False)
    pdf_path = Column(String, nullable=False)
    created_at = Column(String, nullable=False)

    patient = relationship("Patient", back_populates="reports")
    hospital = relationship("User", back_populates="reports")

