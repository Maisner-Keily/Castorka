"""empty message

Revision ID: 184a63deeb86
Revises: db126371a6f7
Create Date: 2020-12-22 01:37:37.852670

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '184a63deeb86'
down_revision = 'db126371a6f7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('comment', sa.Column('email', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('comment', 'email')
    # ### end Alembic commands ###
