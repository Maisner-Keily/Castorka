"""empty message

Revision ID: 866a78dd2555
Revises: f0210596be8b
Create Date: 2020-12-13 02:42:29.520350

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '866a78dd2555'
down_revision = 'f0210596be8b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ProdTg',
    sa.Column('product_id', sa.Integer(), nullable=True),
    sa.Column('tag_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], )
    )
    op.drop_table('ProductTags')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('ProductTags',
    sa.Column('product_id', sa.INTEGER(), nullable=True),
    sa.Column('tag_id', sa.INTEGER(), nullable=True),
    sa.ForeignKeyConstraint(['product_id'], ['product.id'], ),
    sa.ForeignKeyConstraint(['tag_id'], ['tag.id'], )
    )
    op.drop_table('ProdTg')
    # ### end Alembic commands ###
