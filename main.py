from flask import Flask, request, url_for, render_template, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SubmitField, BooleanField, IntegerField
from wtforms.fields.html5 import TelField
from wtforms.validators import DataRequired, Email, Regexp
import datetime

app = Flask(__name__)
app.debug = True
app.config['PERMANENT_SESSION_LIFETIME'] = datetime.timedelta(days=365)
app.config['SECRET_KEY'] = 'a really really really really long secret key'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/python/castorka/mysql.db'
manager = Manager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
manager.add_command('db', MigrateCommand)


class CheckoutForm(FlaskForm):
    name = StringField('name')
    tel = TelField('tel')  # "/(?:\+|\d)[\d\-\(\) ]{9,}\d/g"
    email = StringField('email')
    town = StringField('town')
    street = StringField('street')
    houseNum = StringField('houseNum')
    appartment = IntegerField('appartment')
    comment = TextAreaField('comment')
    send_button = SubmitField('send_button')


product_tags = db.Table('product_tags',
    db.Column('product_id', db.Integer, db.ForeignKey('product.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'))
)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    short_description = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    product_img_src = db.Column(db.String(255), nullable=False)
    bg_color = db.Column(db.String(255), default='#FFFFFF')
    variables = db.relationship('Variable', backref='product')
    tags = db.relationship('Tag', secondary=product_tags)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'{self.id}:{self.title}'


class Variable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    price = db.Column(db.String(255), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'))
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'{self.id}:{self.title}'


class Tag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'{self.id}:{self.title}'


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    text = db.Column(db.Text, nullable=True)
    email = db.Column(db.String(255))
    name = db.Column(db.String(255), default='Покупатель')
    effect = db.Column(db.Integer, default=0)
    delivery = db.Column(db.Integer, default=0)
    product = db.Column(db.String(255), nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def __repr__(self):
        return f'{self.id}:{self.title}'


class Promocode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(255), nullable=False)
    #rub
    discount = db.Column(db.Integer, nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    def __repr__(self):
        return f'{self.id}:{self.code}:{self.discount}'


class Checkout_data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    delivery_method = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    tel = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    town = db.Column(db.String(255))
    street = db.Column(db.String(255))
    house_num = db.Column(db.String(255))
    appartment = db.Column(db.String(255))
    comment = db.Column(db.Text)
    promocode = db.Column(db.String(255))
    products_id = db.Column(db.String(255))
    total_sum = db.Column(db.Integer, nullable=False)
    created_on = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_on = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


    def __repr__(self):
        return f'{self.id}:{self.name}:{self.comment[:15]}'


class Shop_address(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False)
    working_time = db.Column(db.String(255))
    tel = db.Column(db.String(255))

    def __repr__(self):
        return f'{self.id}:{self.address[:15]}'


class Admin_data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    block_id = db.Column(db.String(255))
    page = db.Column(db.String(255), nullable=False)
    key = db.Column(db.String(255), nullable=False)
    value = db.Column(db.String(255))

    def __repr__(self):
        return f'{self.id}:{self.key[:15]}'


def set_product_to_session(product_data):
    if not 'products' in session:
        session['products'] = []

    session['products'].append({
        'product_id' : product_data['product_id'],
        'variable_id' : product_data['variable_id'],
        'count' : product_data['count']
    })

    session.modified = True


@app.route('/', methods=['GET'])
def index():
    if request.method == 'GET':
        products = db.session.query(Product).limit(3).all()

        comment = db.session.query(Comment).filter(Comment.effect > 3, Comment.delivery > 3).first()
        if comment == None:
            comment = db.session.query(Comment).first()

        addresses = db.session.query(Shop_address).all()

        return render_template('index_page.html', products=products, comment=comment, addresses=addresses)


@app.route('/product/<int:id>', methods=['GET'])
def product_page(id):
    if request.method == 'GET':
        comment = db.session.query(Comment).filter(Comment.effect > 3, Comment.delivery > 3).first()
        if comment == None:
            comment = db.session.query(Comment).first()

        addresses = db.session.query(Shop_address).all()

        product = db.session.query(Product).filter(Product.id == id).first()
        variables = db.session.query(Variable).filter(Variable.product_id == id).all()

        return render_template(f'product_page{id}.html', comment=comment, addresses=addresses, product=product, variables=variables)


@app.route('/surfaces', methods=['POST', 'GET'])
def surface():
    if request.method == 'GET':
        comments = db.session.query(Comment).filter(Comment.effect > 3, Comment.delivery > 3).limit(2).all()
        if len(comments) < 2:
            id = comments[0].id
            add_comm = db.session.query(Comment).filter(Comment.id != id).first()
            comments = [comments[0], add_comm]

        addresses = db.session.query(Shop_address).all()

        products = db.session.query(Product).all()

        return render_template('surface_page.html', comments=comments, products=products)

    if request.method == 'POST':

        return '', 200


@app.route('/buy-and-delivery', methods=['GET'])
def buy_n_delivery():
    if request.method == 'GET':
        products = db.session.query(Product).limit(3).all()
        elems = db.session.query(Admin_data).filter(Admin_data.page=='buy_n_del').all()

        return render_template('buy_n_delivery_page.html', products=products, elems=elems)


@app.route('/polit', methods=['GET'])
def polit():
    if request.method == 'GET':
        elems = db.session.query(Admin_data).filter(Admin_data.page=='polit').all()

        return render_template('polit_page.html', elems=elems)
    

@app.route('/checkout', methods=['GET'])
def checkout():
    if request.method == 'GET':
        if not 'products' in session:
            session['products'] = []

        session_products = session.get('products')
        
        products = []
        for product in session_products:
            product_id = product['product_id']
            variable_id = product['variable_id']
            count = product['count']

            variable = db.session.query(Variable).filter(Variable.id == variable_id).first()
            product = db.session.query(Product).filter(Product.id == product_id).first()
            capacity = variable.title
            img_src = product.product_img_src
            color = product.bg_color

            price = None
            for s in variable.price.split(' '):
                if s.isdigit():
                    price = int(s)

            price = price * int(count)

            product_title = db.session.query(Product).filter(Product.id == product_id).first().title

            products.append({
                'title' : product_title,
                'capacity' : capacity,
                'price' : price,
                'count' : count,
                'color' : color,
                'img_src' : img_src
            })

        print(session.get('products'))

        return render_template('checkout_page.html', products=products, CheckoutForm=CheckoutForm)


@app.route('/redirect-to-pay', methods=['POST'])
def redirect_to_pay():
    print('1231')
    if request.method == 'POST':
        delivery_method = request.form.get('delivery_tab')
        name = request.form.get('name')
        tel = request.form.get('tel')
        save = request.form.get('save') != None
        accept_use_private_data = request.form.get('private_data') != None 
        promocode = request.form.get('promocode')
        email = None
        town = None
        street = None
        houseNum = None
        appartment = None
        comment = None
        delivery = 0
        discount = 0
        total_sum = delivery

        if promocode != None:
            discount = db.session.query(Promocode).filter(Promocode.code == promocode).first().discount
        
        else:
            promocode = ''
 
        if delivery_method == 'delivery':
            email = request.form.get('email')
            town = request.form.get('town')
            street = request.form.get('street')
            houseNum = request.form.get('houseNum')
            appartment = request.form.get('appartment')
            comment = request.form.get('comment')

        products = session.get('products')
        for product in products:
            variable = db.session.query(Variable).filter(Variable.id == product['variable_id']).first()
            price = None
            for s in variable.price.split(' '):
                if s.isdigit():
                    price = int(s)

            price = price * int(product['count'])
            total_sum += price

        total_sum = total_sum - discount
        if total_sum < 0:
            total_sum = 0


        checkout = None
        if delivery_method == 'delivery':
            checkout = Checkout_data(
                delivery_method = delivery_method,
                name = name,
                tel = tel,
                email = email,
                town = town,
                street = street,
                house_num = houseNum,
                appartment = appartment,
                comment = comment,
                promocode = promocode,
                total_sum = total_sum)

        else:
            checkout = Checkout_data(
                delivery_method = delivery_method,
                name = name,
                tel = tel,
                promocode = promocode,
                total_sum = total_sum

            )

        db.session.add(checkout)
        db.session.commit()

        # обработать всё, создать ссылку на юнит, сделать редирект

    return '', 200




@app.route('/get-cart-items-from-session', methods=['POST'])
def return_cart_list():
    if not 'products' in session:
        session['products'] = []

    product_list = session.get('products')
    
    res = ''

    if product_list != []:

        for item in product_list:
            ### переделка массива айтемов в строку по виду
            ### 'key:value,key:value.... '
            item_str = ''
            
            for k in item:
                item_str += str(k)
                item_str += ':'
                item_str += str(item[k])
                item_str += ','

            item_str = item_str[0: len(item_str) - 1]
            item_str += '&'
            res += item_str

        res = res[0: len(res) - 1]

    if res == '':
        res = 'cart is empty'

    print('res = ' + res)

    return res


@app.route('/get-cart-items-count', methods=['POST'])
def return_items_count():
    if not 'products' in session:
        session['products'] = []

    return str(len(session.get('products')))


@app.route('/change-products-count-in-session', methods=['POST'])
def change_count():
    req = request.data.decode()
    
    if req != 'cart is empty':
        products_list = session.get('products')

        for item in req.split('&'):
            item_data = item.split('^')
            item_index = int(item_data[0].split('=')[1])
            item_count = int(item_data[1].split('=')[1])

            products_list[item_index]['count'] = item_count

        session['products'] = products_list
        session.modified = True


    return '', 200


@app.route('/remove-item-from-session', methods=['POST'])
def remove_item():
    req = int(request.data.decode())

    if not 'products' in session:
        session['products'] = []

    product_list = session.get('products')
    del product_list[req]

    session['products'] = product_list


    return '', 200


@app.route('/get-all-products', methods=['POST'])
def return_all_products():
    product_count = db.session.query(Product).count()
    
    data = ''
    for i in range(1, product_count + 1):
        product = db.session.query(Product).filter(Product.id == i).first()

        data += str(product.id) + '_' + str(product.title) + '_' + str(product.product_img_src) + '_' + str(product.bg_color)
        data += '&'
        variables = db.session.query(Variable).filter(Variable.product_id == product.id).all()

        for variable in variables:
            data += str(variable.id) + '_' + str(variable.title) + '_' + str(variable.price)
            data += '^'

        data = data[0:len(data) - 1]

        data += '-'
    
    data = data[0:len(data) - 1]

    return data


@app.route('/get-more-comments', methods=['POST'])
def get_comments():
    req = request.data.decode().split('&')

    comments = db.session.query(Comment).filter(Comment.text.notin_(req)).limit(3).all()

    res = ''
    for comment in comments:
        res += 'name=' + comment.name + '^' + 'text=' + comment.text + '^' + 'product_name=' + comment.product + '^' + 'effect=' + str(comment.effect) + '^' + 'delivery=' + str(comment.delivery)
        res += '&'

    res = res[0:len(res)-1]

    if len(comments) == 0:
        res = 'comments is`t already exist'


    return res


@app.route('/check-promocode', methods=['POST'])
def check_promocode():
    req = request.data.decode()
    promocode = db.session.query(Promocode).filter(Promocode.code == req).first()
    
    if promocode != None:
        return str(promocode.discount)

    else:
        return 'not found'


@app.route('/add-comment-to-db', methods=['POST'])
def add_comment():
    req = request.data.decode().split('&')
    req_data = {}

    for par in req:
        par_data = par.split('=')
        req_data[f'{par_data[0]}'] = par_data[1]

    comment = Comment(
        title=req_data['text'][:10], 
        text=req_data['text'],
        email=req_data['email'],
        name=req_data['name'],
        effect=int(req_data['effect']),
        delivery=int(req_data['delivery']),
        product=req_data['product'])

    db.session.add(comment)
    db.session.commit()

    return '', 200


@app.route('/set-product-to-session', methods=['POST'])
def return_product():
    req = request.data.decode().split('&')
    req_data = {}
    for par in req:
        par_data = par.split('=')
        req_data[f'{par_data[0]}'] = par_data[1]

    product_id = db.session.query(Product).filter(Product.title == req_data['title']).first().id

    product_data = {
        'product_id' : product_id,
        'variable_id' : '',
        'count' : req_data['count']
    }

    if 'capacity' in req_data:
        variable_id = db.session.query(Variable).filter(Variable.product_id == product_id, Variable.title == req_data['capacity']).first().id

    else:
        variable_id = db.session.query(Variable).filter(Variable.product_id == product_id).first().id

    product_data['variable_id'] = variable_id

    set_product_to_session(product_data)


    return 'ok'


if __name__ == '__main__':
    # manager.run()
    app.run() 