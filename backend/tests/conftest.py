import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db import Base, get_db_session
from app.models.sqlalchemy import Product, Category, ProductSize, User, Cart, Cart_Item, Order, OrderItem
import os

# Test database URL
TEST_DATABASE_URL = "postgresql://test_user:test_password@localhost:5432/test_ecommerce"

@pytest.fixture(scope="session")
def engine():
    """Create test database engine"""
    return create_engine(TEST_DATABASE_URL)

@pytest.fixture(scope="session")
def tables(engine):
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(engine, tables):
    """Create test database session"""
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection)()

    # Override get_db_session to use test session
    original_get_db = get_db_session
    def override_get_db():
        return session

    import app.db
    app.db.get_db_session = override_get_db

    yield session

    session.close()
    transaction.rollback()
    connection.close()

    # Restore original function
    app.db.get_db_session = original_get_db

@pytest.fixture
def sample_user(db_session):
    """Create sample user for testing"""
    user = User(
        uuid="test-user-uuid",
        email="test@example.com",
        first_name="Test",
        last_name="User",
        role="user"
    )
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def sample_product(db_session):
    """Create sample product for testing"""
    product = Product(
        slug="test-product",
        product_type="test",
        product_name="Test Product",
        price=100.0,
        stock=50
    )
    db_session.add(product)
    db_session.commit()
    return product

@pytest.fixture
def sample_category(db_session):
    """Create sample category"""
    category = Category(name="Test Category")
    db_session.add(category)
    db_session.commit()
    return category