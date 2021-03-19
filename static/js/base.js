'use strict'

const cart        = document.getElementById('cart');
const cart_header = document.getElementsByClassName('cart__header')[0];
const cart_main   = document.getElementsByClassName('cart__main')[0];
const cart_footer = document.getElementsByClassName('cart__footer')[0];

const loader_node = document.createElement('div');
loader_node.classList.add('windows8');
loader_node.innerHTML = '<div class="wBall" id="wBall_1"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_2"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_3"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_4"><div class="wInnerBall"></div></div><div class="wBall" id="wBall_5"><div class="wInnerBall"></div></div>'


document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementsByTagName('nav')[0];
    const main = document.getElementsByTagName('main')[0];
    const footer = document.getElementsByTagName('footer')[0];

    main.style.paddingTop = (nav.clientHeight).toString() + 'px';
    main.style.paddingBottom = (footer.clientHeight).toString() + 'px';

    const cart_main_height = (cart.clientHeight 
                        - cart_header.clientHeight 
                        - cart_footer.clientHeight - 80).toString() + 'px';

    cart_main.style.height = cart_main_height;

})

function getXhrObject() {
    if(typeof XMLHttpRequest === 'undefined') {
        XMLHttpRequest = function() {
        try { 
            return new window.ActiveXObject( "Microsoft.XMLHTTP" ); 
        } catch(e) {}
      };
    }
    return new XMLHttpRequest();
}


const is_valid_email = email => {
    return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(email);
}


const find_product = product_id => {
    for (let product of all_products) {
        if (product.id == product_id) {
            return product
        }
    }
}


const get_variable = (product, variable_id) => {
    for (let variable of product.variables) {
        if (variable.id == variable_id) {
            return variable
        }
    }
}


const create_item_in_cart = (item_data, index) => {
    const product = find_product(item_data.product_id);
    const variable = get_variable(product, item_data.variable_id);

    const item = document.createElement('div');
    item.classList.add('cart__item');
    item.classList.add('item');


    const item_img_wrap = document.createElement('div');
    item_img_wrap.classList.add('item__img');
    item_img_wrap.setAttribute('style', `background-color: ${product.bg_color}`);

    const item_img = document.createElement('img');
    item_img.setAttribute('src', product.img_src);

    item_img_wrap.append(item_img)


    const item_content = document.createElement('div');
    item_content.classList.add('item__content');

    const item_title = document.createElement('h4');
    item_title.classList.add('item__title');
    item_title.classList.add('philosopher');
    item_title.innerHTML = product.title;

    const item_input = document.createElement('input');
    item_input.classList.add('item__input');
    item_input.setAttribute('style', 'display:none');
    item_input.setAttribute('type', 'text');

    const select_wrap = document.createElement('div');

    const select_value = document.createElement('div');
    select_value.classList.add('item__select_value');
    select_value.setAttribute('onclick', 'item_select_click(this)');
    select_value.setAttribute('onselectstart', 'return false');
    select_value.setAttribute('onmousedown', 'return false');


    const select_p = document.createElement('p');
    select_p.innerHTML = variable.capacity;

    const select_svg = document.createElement('div');
    select_svg.innerHTML = '<svg width="13" height="8" viewBox="0 0 13 8" fill="none"><path d="M6.5 8L12.1292 0.5H0.870835L6.5 8Z" fill="#527C77"></path></svg>';


    const select_list = document.createElement('div');
    select_list.classList.add('item__select_list');

    for (let variable of product.variables) {
        const select_option = document.createElement('a');
        select_option.classList.add('item__select_option');
        select_option.setAttribute('onclick', `set_cartItem_value(value='${variable.capacity}', block=this); render_cart_prices()`);
        select_option.innerHTML = variable.capacity;

        select_list.append(select_option);
    }

    select_value.append(select_p);
    select_value.append(select_svg);
    select_value.append(select_list);

    const item_price = document.createElement('div');
    item_price.classList.add('item__price');
    item_price.innerHTML = variable.price;

    select_wrap.append(select_value);
    select_wrap.append(item_price);

    const amount_and_delete_wrap = document.createElement('div');
    const amount = document.createElement('div');
    amount.classList.add('amount');
    
    const amount_plus = document.createElement('a');
    amount_plus.setAttribute('onclick', 'amount_plus(this); render_cart_prices()');
    amount_plus.setAttribute('onselectstart', 'return false');
    amount_plus.setAttribute('onmousedown', 'return false');
    amount_plus.innerHTML = '+';

    const amount_input = document.createElement('input');
    amount_input.setAttribute('type', 'text');
    amount_input.setAttribute('value', item_data['count'.toString()]); /////////////// нужно дописать реализацию получение
    // количества товара из сессии и отображения здесь

    const amount_minus = document.createElement('a');
    amount_minus.setAttribute('onclick', 'amount_minus(this); render_cart_prices()');
    amount_minus.setAttribute('onselectstart', 'return false');
    amount_minus.setAttribute('onmousedown', 'return false');
    amount_minus.innerHTML = '-';

    amount.append(amount_plus);
    amount.append(amount_input);
    amount.append(amount_minus);

    const item_delete = document.createElement('a');
    item_delete.setAttribute('onclick', `remove_cart_item(index=${index}, block=this); render_cart_prices();`)
    item_delete.classList.add('item__delete');
    item_delete.innerText = 'Удалить';

    amount_and_delete_wrap.append(amount);
    amount_and_delete_wrap.append(item_delete);

    item_content.append(item_title);
    item_content.append(item_input);
    item_content.append(select_wrap);
    item_content.append(amount_and_delete_wrap);

    item.append(item_img_wrap);
    item.append(item_content);

    return item

}


const check_promocode = (block) => {
    const input = block.parentNode.getElementsByTagName('input')[0];
    const link = block.parentNode.getElementsByTagName('a')[0];
    const input_parent = input.parentNode;
    const input_value = input.value;
    const request = getXhrObject();
    const url = '/check-promocode';
    const params = `${input_value}`;

    request.addEventListener('readystatechange', () => {

        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText == 'not found') {
                return

            } else {
                const discount = parseInt(request.responseText);
                const total_price_node = document.getElementsByClassName('checkout__cart__sum')[0];
                const total_price = parseInt(total_price_node.innerText.match(/\d+/));
                const price_with_discount = total_price - discount;
                total_price_node.innerHTML = `<div class="checkout__cart__sum"><span>Общая сумма:</span>${price_with_discount} руб</div>`;

                input.remove();
                link.remove();
                const promocode_node = document.createElement('div');
                promocode_node.innerHTML = input_value;
                promocode_node.classList.add('promocode__used');

                input_parent.append(promocode_node);

                const promocode_input = document.createElement('input');
                promocode_input.setAttribute('name', 'promocode');
                promocode_input.setAttribute('value', input_value);
                promocode_input.style.display = 'none';
                const form = document.getElementById('checkout_form');
                form.append(promocode_input);

            }
        }
    })
    
    request.open('POST', url, true);
    request.send(params);
}


const amount_plus = (block) => {
    const input = block.parentNode.getElementsByTagName("input")[0];
    const value = parseInt(input.value, 10) + 1;
    input.setAttribute('value', value);

    console.log(input);
}


const amount_minus = (block) => {
    const input = block.parentNode.getElementsByTagName("input")[0];
    let value = parseInt(input.value, 10) - 1;
    if ( value < 1 ) {
        value = 1;
    }

    input.setAttribute('value', value);

    console.log(input);
}


let all_products = []
const request_get_all = getXhrObject();
const url_get_all = '/get-all-products';
  
request_get_all.open('POST', url_get_all, true)
request_get_all.addEventListener('readystatechange', () => {

    if (request_get_all.readyState == 4 && request_get_all.status == 200) {

        let products_data = request_get_all.responseText.split('-')

        for (let product of products_data) {
            const data = product.split('&')
            let product_data = data[0].split('_')
            product_data = {
                'id' : product_data[0],
                'title' : product_data[1],
                'img_src' : product_data[2],
                'bg_color' : product_data[3],
            }

            let variables_data = []
            for (let variable of data[1].split('^')) {

                let variable_data = variable.split('_')
                variable_data = {
                    'id' : variable_data[0],
                    'capacity' : variable_data[1],
                    'price' : variable_data[2]
                }
                variables_data.push(variable_data)
            }

            product_data['variables'] = variables_data

            all_products.push(product_data)

        }

    }
})

request_get_all.send()


const request_get_products_count = getXhrObject();
const url_get_products_count = '/get-cart-items-count';

request_get_products_count.addEventListener('readystatechange', () => {

    if (request_get_products_count.readyState == 4 && request_get_products_count.status == 200) {
        const count = request_get_products_count.responseText;
        const nav_cart_items_count_node = document.getElementsByClassName('communicate__ellipse')[0];  
        nav_cart_items_count_node.innerText = parseInt(count);
    }
})
    
request_get_products_count.open('POST', url_get_products_count, true);
request_get_products_count.send();


const toggle_menu = () => {
    const menu = document.getElementsByClassName('menu')[0];
    menu.classList.toggle('menu__on');
    
    if (menu.classList.contains('menu__on')) {
        document.body.style.maxHeight = '100vh';
        document.body.style.overflow = 'hidden';

    } else {
        document.body.style.maxHeight = 'none';
        document.body.style.overflow = 'visible';
    }
}


function toggle_cart(title='', get_count=false, is_open=true, get_capacity=false) {
    const cart = document.getElementsByClassName('cart')[0];
    cart.classList.toggle('cart__on');
    
    // if (cart.classList.contains('cart__on')) {
    //     document.body.style.maxHeight = '100vh';
    //     document.body.style.overflow = 'hidden';

    // } else {
    //     document.body.style.maxHeight = 'none';
    //     document.body.style.overflow = 'visible';
    // }

    if (title != '') {
        add_product_to_cart(title, get_count, get_capacity);
    }

    if (is_open) {
        const cart_main = document.getElementsByClassName('cart__main')[0];
        cart_main.style.display = 'flex';
        cart_main.append(loader_node);

    } else {
        const request = getXhrObject();
        const url = '/change-products-count-in-session';
        const cart_items = document.getElementsByClassName('cart__item');

        let params = '';

        if (cart_items.length !== 0) {
            let i = 0;
            for (let cart_item of cart_items) {
                const amount = cart_item.getElementsByClassName('amount')[0].getElementsByTagName('input')[0].value;
                
                params += `index=${i}^amount=${amount}`;
                params += '&';

                i++;
            } 

            params = params.substring(0, params.length-1);

        } else {
            params = 'cart is empty';
        }
        
        request.open('POST', url, true)
        request.send(params)
    }
    
}


const add_product_to_cart = (title, get_count, get_capacity) => {
    const request = getXhrObject();
    const url = '/set-product-to-session';
    let params = 'title=' + title;

    if (get_capacity) {
        const capacity = document.getElementsByClassName('form__select_value')[0].getElementsByTagName('p')[0].innerText;
        params += '&capacity=' + capacity;
    }

    let count = undefined;
    if (get_count) {
        count = parseInt(document.getElementsByClassName('form__amount')[0].getElementsByTagName('input')[0].value);
    } else {
        count = 1;
    }
    params += '&count=' + count;
    
    request.open('POST', url, true)
    request.addEventListener('readystatechange', () => {

        if (request.readyState == 4 && request.status == 200) {
            render_cart_items();
        }
    })

    console.log(params);

    request.send(params)
}


function render_cart_items() {
    const request = getXhrObject();
    const url = '/get-cart-items-from-session';

    while(cart_main.firstChild) {
        cart_main.removeChild(cart_main.firstChild)
    }

    request.open('POST', url, true)
    request.addEventListener('readystatechange', () => {

        if (request.readyState == 4 && request.status == 200) {
            // console.log(request.responseText);

            const cart_items_count_node = document.getElementsByClassName('cart__ellipse')[0]; 
            const nav_cart_items_count_node = document.getElementsByClassName('communicate__ellipse')[0];           
            let items_count = 0;

            if (request.responseText !== 'cart is empty') {
                let cart_items = [];
                cart_main.style.display = 'block';

                for (let item of request.responseText.split('&')) {
                    let qualityes = {};

                    for (let quality of item.split(',')) {
                        const value = quality.split(':');
                        qualityes[value[0]] = value[1];
                    }

                    cart_items.push(qualityes);
                }

                for (let i in cart_items) {
                    items_count += 1;
                    const item = cart_items[i];
                    const cart_item =  create_item_in_cart(item, i);
                    cart_main.append(cart_item);
                }

            } else {
                const empty_node = document.createElement('div');
                empty_node.innerHTML = 'Вы не добавили товаров';
                empty_node.setAttribute('style', 'text-align: center;')
                cart_main.style.display = 'flex';
                cart_main.append(empty_node);
            }

            loader_node.remove();

            render_cart_prices();
            cart_items_count_node.innerText = items_count;
            nav_cart_items_count_node.innerText = items_count;
        }
    })

    request.send()
}


const render_cart_prices = () => {
    const cart_items = document.getElementsByClassName('cart__item');
    const total_sum_node = document.getElementsByClassName('cart__sum')[0].getElementsByTagName('p')[0];
    let total_sum = 0;

    for (let item of cart_items) {
        const price_node = item.getElementsByClassName('item__price')[0];
        let amount_num = item.getElementsByClassName('amount')[0].getElementsByTagName('input')[0].value;
        amount_num = parseInt(amount_num);
        const product_title = item.getElementsByClassName('item__title')[0].innerText;
        const capacity = item.getElementsByClassName('item__select_value')[0].getElementsByTagName('p')[0].innerText;

        let current_variable = undefined;
        for (let prod of all_products) {
            if (prod['title'] == product_title) {
                for (let varib of prod['variables']) {
                    if (varib['capacity'] == capacity) {
                        current_variable = varib;
                    }
                }
            }
        }
        const variable_price = parseInt(current_variable['price'].match(/\d+/));
        let current_sum = variable_price * amount_num;
        total_sum += current_sum;
        current_sum = current_sum.toString() + ' руб';
        price_node.innerText = current_sum;
    }

    total_sum_node.innerText = total_sum.toString() + ' руб';
}


const remove_cart_item = (index, block) => {
    const item = block.parentNode.parentNode.parentNode;
    item.remove();

    const request = getXhrObject();
    const url = '/remove-item-from-session';
    const params = `${index}`;

    request.addEventListener('readystatechange', () => {

        if (request.readyState == 4 && request.status == 200) {
            render_cart_items();
        }
    })
    
    request.open('POST', url, true);
    request.send(params);
}
