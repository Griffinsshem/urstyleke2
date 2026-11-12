"""add server default to users.is_admin

Revision ID: a1f3c9d27b40
Revises: fadc67ae485c
Create Date: 2026-11-12 09:45:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1f3c9d27b40'
down_revision = 'fadc67ae485c'
branch_labels = None
depends_on = None


def upgrade():
    # The database itself now defaults new users to non-admin, so an omitted
    # value can never cause a NOT NULL failure or an accidental NULL.
    op.alter_column(
        'users',
        'is_admin',
        existing_type=sa.Boolean(),
        existing_nullable=False,
        server_default=sa.false(),
    )


def downgrade():
    op.alter_column(
        'users',
        'is_admin',
        existing_type=sa.Boolean(),
        existing_nullable=False,
        server_default=None,
    )
