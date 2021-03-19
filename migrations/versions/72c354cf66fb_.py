"""empty message

Revision ID: 72c354cf66fb
Revises: 184a63deeb86
Create Date: 2020-12-25 01:02:15.362075

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '72c354cf66fb'
down_revision = '184a63deeb86'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('shop_address', sa.Column('tel', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('shop_address', 'tel')
    # ### end Alembic commands ###
