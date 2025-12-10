"""add product_colors table for color + image per product

Revision ID: add_product_colors
Revises: 6a4d266ee151
Create Date: 2025-12-10
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'add_product_colors'
down_revision: Union[str, None] = '6a4d266ee151'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.create_table(
        'product_colors',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('color', sa.String(), nullable=False),
        sa.Column('image_url', sa.String(), nullable=True)
    )

def downgrade() -> None:
    op.drop_table('product_colors')
