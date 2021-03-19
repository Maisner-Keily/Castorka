"""empty message

Revision ID: db126371a6f7
Revises: 916f4c05550c
Create Date: 2020-12-22 00:43:43.395370

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'db126371a6f7'
down_revision = '916f4c05550c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('comment', 'title',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('comment', 'title',
               existing_type=sa.VARCHAR(),
               nullable=False)
    # ### end Alembic commands ###
