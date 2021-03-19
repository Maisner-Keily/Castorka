'use strict'

const render_comment = data => {
    const tear_color_active = '#FFEB85';

    const comment_wrap = document.createElement('div');
    comment_wrap.classList.add('comment');

    const first_wrap = document.createElement('div');
    const twice_wrap = document.createElement('div');

    const author = document.createElement('div');
    author.classList.add('comment__author');
    author.classList.add('philosopher');
    author.innerHTML = data.name;

    const score_wrap = document.createElement('div');
    score_wrap.classList.add('comment__score');

    const effect_wrap = document.createElement('div');
    effect_wrap.classList.add('comment__effect');

    const effect_title = document.createElement('div');
    effect_title.innerHTML = 'Эффект';

    const effect_num = document.createElement('div');
    effect_num.classList.add('comment__score_num');

    for (let i=1; i<=parseInt(data.effect, 10); i++) {
        const tear = document.createElement('div');
        tear.classList.add('tear');
        tear.setAttribute('style', `border: none; background-color: ${tear_color_active}`);

        effect_num.append(tear);
    }

    if (parseInt(data.effect, 10) < 5) {
        for (let i=1; i<(6 - parseInt(data.effect, 10)); i++) {
            const tear = document.createElement('div');
            tear.classList.add('tear');
            tear.setAttribute('style', `border: 1px solid #DCE4E4; background-color: transparent;`);
            
            effect_num.append(tear);
        }
    }

    effect_wrap.append(effect_title);
    effect_wrap.append(effect_num);


    const delivery_wrap = document.createElement('div');
    delivery_wrap.classList.add('comment__effect');

    const delivery_title = document.createElement('div');
    delivery_title.innerHTML = 'Доставка';

    const delivery_num = document.createElement('div');
    delivery_num.classList.add('comment__score_num');

    for (let i=1; i<=parseInt(data.delivery, 10); i++) {
        const tear = document.createElement('div');
        tear.classList.add('tear');
        tear.setAttribute('style', `border: none; background-color: ${tear_color_active}`);

        delivery_num.append(tear);
    }

    if (parseInt(data.delivery, 10) < 5) {
        for (let i=1; i<(6 - parseInt(data.delivery, 10)); i++) {
            const tear = document.createElement('div');
            tear.classList.add('tear');
            tear.setAttribute('style', `border: 1px solid #DCE4E4; background-color: transparent;`);
            
            delivery_num.append(tear);
        }
    }

    delivery_wrap.append(delivery_title);
    delivery_wrap.append(delivery_num);


    score_wrap.append(effect_wrap);
    score_wrap.append(delivery_wrap);


    first_wrap.append(author);
    first_wrap.append(score_wrap);

    const product = document.createElement('div');
    product.classList.add('comment__product');
    product.classList.add('philosopher');
    product.innerHTML = data.product_name;

    const comment = document.createElement('div');
    comment.classList.add('comment__text');
    comment.innerHTML = data.text;

    twice_wrap.append(product);
    twice_wrap.append(comment);

    comment_wrap.append(first_wrap); 
    comment_wrap.append(twice_wrap); 

    return comment_wrap
}


const send_submit = document.getElementById('addSurface__send');

send_submit.addEventListener('click', () => {
    const inputs = document.getElementsByClassName('addSurface__input-field');
    const input_email = document.getElementById('addSurface__email');
    let validate = true;

    for (let input of inputs) {
        const input_wrap = input.parentNode;

        const finded_span = input_wrap.getElementsByTagName('span')[0];
        if (finded_span) {
            finded_span.remove()
        }

        const span = document.createElement('span');
        span.classList.add('addSurface__error');
        span.innerHTML = 'Это поле должно быть заполнено'; 

        if ((input.value.indexOf('^') !== -1) || (input.value.indexOf('&') !== -1)) {
            span.innerHTML = 'Это поле содержит запрещённые символы ^ или &'
        } 
            
        if (input.value == '' || input.value.indexOf('^') !== -1 || input.value.indexOf('&') !== -1) {
            validate = false;

            input_wrap.append(span);

        }   
    }

    const validate_email = is_valid_email(input_email.value)
    if (!validate_email) {
        validate = false

        if (!input_email.parentNode.getElementsByTagName('span')[0]) {
            const span = document.createElement('span');
            span.classList.add('addSurface__error');
            span.innerHTML = 'Неправильно введён email';

            input_email.parentNode.append(span)
        }
    }

    if (validate) {
        const name = document.getElementsByName('name')[0].value;
        const email = document.getElementsByName('email')[0].value;
        const comment_text = document.getElementsByName('comment_text')[0].value;

        let checked_product = undefined;
        for (let input of document.getElementsByName('product')) {
            if (input.checked) {
                checked_product = input.value;
            }
        }

        let effect_score = undefined;
        for (let input of document.getElementsByName('effect')) {
            if (input.checked) {
                effect_score = input.value;
            }
        }
        
        if (effect_score == undefined) {
            effect_score = 0
        }

        let delivery_score = undefined;
        for (let input of document.getElementsByName('delivery')) {
            if (input.checked) {
                delivery_score = input.value;
            }
        }
        
        if (delivery_score == undefined) {
            delivery_score = 0
        }

        const request = getXhrObject();
        const url = '/add-comment-to-db';
        const params = `name=${name}&email=${email}&text=${comment_text}&product=${checked_product}&effect=${effect_score}&delivery=${delivery_score}`
        
        request.open('POST', url, true)
        request.send(params)

        const comment_node = render_comment({
            'name' : name,
            'effect' : effect_score,
            'delivery' : delivery_score,
            'product_name' : checked_product,
            'text' : comment_text,
        })

        const comments_wrap = document.getElementById('surfaces');
        comments_wrap.prepend(comment_node);
    }
})

//  ДОДЕЛАТЬ ФУНКЦИЮ ДОБАВЛЕНИЯ КОММЕНТОВ ПО НАЖАТИЮ КНОПКИ
const more_button = document.getElementById('show_more');
more_button.addEventListener('click', () => {
    let comments = [].slice.call(document.getElementsByClassName('comment'));
    comments = comments.slice(0, comments.length - 1);

    let params = '';
    for (let comment of comments) {
        const comment_text = comment.getElementsByClassName('comment__text')[0].innerText;
        params += comment_text.trim();
        params += '&';
    }

    params = params.substring(0, params.length-1);

    const request = getXhrObject();
    const url = '/get-more-comments';

    request.open('POST', url, true)
    request.addEventListener('readystatechange', () => {

        if (request.readyState == 4 && request.status == 200) {
            console.log(request.responseText);
            
            if (request.responseText !== 'comments is`t already exist') {
                let comments_data = [];
                for (let comment_data of request.responseText.split('&')) {
                    let qualityes = {};

                    for (let quality of comment_data.split('^')) {
                        const value = quality.split('=');
                        qualityes[value[0]] = value[1];
                    }

                    comments_data.push(qualityes);
                }

                for (let comment of comments_data) {
                    const comment_node = render_comment(comment);

                    const comments_wrap = document.getElementById('surfaces');
                    comments_wrap.append(comment_node);

                }

            } else {
                more_button.remove()
            }
        }
    })

    request.send(params)
})