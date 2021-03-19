'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementsByTagName('main')[0];
    const footer = document.getElementsByTagName('footer')[0];
    const body = document.getElementsByTagName('body')[0];

    const main_height = (body.clientHeight - footer.clientHeight).toString() + 'px';

    main.style.minHeight = main_height;
})


const enter_validate_error = (wrapper_class, error_text) => {
    const wrapper = document.getElementsByClassName(`${wrapper_class}`)[0];
    if (!wrapper.classList.contains('checkout__input-error')) {
        wrapper.classList.add('checkout__input-error');
        const span = document.createElement('span');
        span.innerHTML = error_text;
        span.classList.add('checkout__error');
        wrapper.append(span)
        
    }  
}


const footer_heigth = document
    .getElementsByClassName('checkout__cart_footer')[0]
    .clientHeight;


document.getElementsByClassName('checkout__cart')[0]
    .style.paddingBottom = footer_heigth.toString() + 'px';


const form_submit = document.getElementById('hidden_submit');
const form = document.getElementById('checkout_form');


form.addEventListener('submit', event => {
    event.preventDefault();
    let validate = true;
    const private_checkbox = document.getElementById('private_data');

    let input_wraps;

    let active_tab = document.getElementsByClassName('delivery__tabs')[0]
        .querySelectorAll('input:checked')[0]
        .parentNode
        .getAttribute('data-tab-name');

    if (active_tab == 'delivery') {
        input_wraps = document.getElementsByClassName('checkout__input-wrap');
    } else if (active_tab == 'pickup') {
        input_wraps = [document.getElementsByClassName('checkout__name')[0], document.getElementsByClassName('checkout__tel')[0]];
    } else {
        alert('error')
    }


    for (let i=0; i<input_wraps.length; i++) {
        if (input_wraps[i].classList.contains('checkout__input-error')) {
            let find_span = input_wraps[i].getElementsByClassName('checkout__error')[0];
            input_wraps[i].classList.remove('checkout__input-error');
            find_span.remove()
        }
    }

    private_checkbox.style.outline = 'none';

    // required check
    for (let i=0; i<input_wraps.length; i++) {

        // необязательные поля
        if (input_wraps[i].classList.contains('checkout__appartment')) {
            continue
        } 

        
        let input = input_wraps[i].getElementsByTagName('input')[0];
        let span = document.createElement('span');
        span.classList.add('checkout__error');
        span.innerHTML = 'Это поле должно быть заполнено'; 
        
        if (input.value == '') {
            validate = false;

            input_wraps[i].classList.add('checkout__input-error');
            input_wraps[i].append(span);

        }

    }

    // tel regulax exp check
    const tel_input = document.getElementsByClassName('checkout__tel')[0].getElementsByTagName('input')[0].value;
    const regexp_tel = /(?:\+|\d)[\d\-\(\) ]{9,}\d/g;
    const tel_check = regexp_tel.test(tel_input);

    if (!tel_check) {
        validate = false;
        
        enter_validate_error('checkout__tel', 'Телефон введён неверно') 
    }

    //email check

    if (active_tab == 'delivery') {
        const email_input = document.getElementsByClassName('checkout__email')[0].getElementsByTagName('input')[0].value;
        const regexp_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const email_check = regexp_email.test(email_input);

        if (!email_check) {
            validate = false;

            enter_validate_error('checkout__email', 'Email введён неверно') 
        }
    }

    if (!private_checkbox.checked) {
        validate = false;
        document.getElementById('private_data_label').classList.add('invalid_checkbox');
    }

    console.log(validate);
    if (validate) {
        console.log('123')
        form.submit()
    }
})