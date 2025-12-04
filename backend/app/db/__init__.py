import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from colorama import Fore

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

Base = declarative_base()

def get_db_engine():
    try:
        engine = create_engine(DATABASE_URL, echo=True)
        return engine
    except Exception as e:
        print(f"{Fore.RED}Error creating database engine: {e}{Fore.WHITE}")
        return None

def get_db_session():
    engine = get_db_engine()
    Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    return Session()

def create_tables():
    engine = get_db_engine()
    Base.metadata.create_all(bind=engine)
