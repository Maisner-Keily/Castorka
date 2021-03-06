"""empty message

Revision ID: f0210596be8b
Revises: d1478f5f8fe1
Create Date: 2020-12-13 02:41:26.910014

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f0210596be8b'
down_revision = 'd1478f5f8fe1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ProductTags',
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], )
    )
    op.drop_table('product_tags')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('product_tags',
    sa.Column('product_id', sa.INTEGER(), nullable=True),
    sa.Column('tag_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], )
    )
    op.drop_table('ProductTags')
    # ### end Alembic commands ###
