'use strict'

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.clientWidth <= 770) {
        document.getElementsByClassName('slick-next')[0].style.right = '70px';
        document.getElementsByClassName('slick-prev')[0].style.left = '70px';
        
    } else if(document.body.clientWidth <= 450) {
        document.getElementsByClassName('slick-next')[0].style.right = '40px';
        document.getElementsByClassName('slick-prev')[0].style.left = '40px';
    }

    $.stellar({
        scrollProperty: 'transform'
    });
})

if (document.body.clientWidth <= 768) {
    $(document).ready(function(){
        $('.products__wrap').slick({
            dots: false,
            infinite: true,
            speed: 300,
            slidesToShow: 1,
            centerMode: true,
            arrows: true
        });
    });
} else {
    const product_list = document.getElementsByClassName('product__wrapper');
    let mah = product_list[0].clientHeight + product_list[1].clientHeight + 100;
    const products__wrap = document.getElementsByClassName('products__wrap')[0];
    products__wrap.style.height = mah.toString() + 'px';

}