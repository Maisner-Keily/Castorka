'use strict'

document.addEventListener('DOMContentLoaded', () => {

    if (document.body.clientWidth > 1000) {
        $(window).stellar({
            horizontalOffset: 0
        });
    }

    const hero_bg = document.getElementsByClassName('hero__bg')[0];
    hero_bg.classList.add('hero__bg-active');

    const hero_img = document.getElementsByClassName('hero__img')[0];
    hero_img.classList.add('hero__img-active');
})


const select_click = (block) => {
    const list = document.getElementsByClassName('form__select_list')[0];
    if (window
        .getComputedStyle(list, null)
        .getPropertyValue('display') == 'block') {
        list.style.display = 'none';
    } else {
        list.style.display = 'block';
    }
}


const render_price = (capac='') => {
    const product_title = document.getElementsByClassName('hero__title')[0].innerText;
    
    let capacity = capac;
    if (capacity == '') {
        capacity = document.getElementsByClassName('form__select_value')[0].getElementsByTagName('p')[0].innerText;
    }

    let current_variable = undefined;
    for (let product of all_products) {
        if (product['title'] == product_title) {
            for (let varib of product['variables']) {
                if (varib['capacity'] == capacity) {
                    current_variable = varib;
                }
            }
        }
    }

    const variable_price = parseInt(current_variable['price']);
    const count = parseInt(document.getElementsByClassName('form__amount')[0].getElementsByTagName('input')[0].value);
    const price_node = document.getElementsByClassName('form__price')[0].getElementsByTagName('span')[0];

    console.log(count);

    price_node.innerText = (variable_price * count).toString() + ' руб';

}