"""empty message

Revision ID: b2ad4a9d6163
Revises: 0892f19d837e
Create Date: 2020-12-15 16:28:00.008434

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b2ad4a9d6163'
down_revision = '0892f19d837e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('product', sa.Column('bg_color', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('product', 'bg_color')
    # ### end Alembic commands ###