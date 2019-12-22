var cart = [];

function addToCart(e) {
    if(!cart.includes(id)) {
        cart.push(id);
        var el = $(e);
        var img = el.parent().parent().find('img');
        $(img).clone().removeClass('w-100').css({
            'position' : 'absolute',
            'width' : $(img)[0].clientWidth,
            'z-index' : '999',
            'top' : $(img).offset().top,
            'left' : $(img).offset().left
        }).appendTo("body").animate({
            'opacity' : 0.6,
            'left' : $(".fa-shopping-cart").offset()['left']+10,
            'top' : $(".fa-shopping-cart").offset()['top']+5,
            'width' : '20px'
        }, 1500, function() {
            $(this).remove();
        });
    }
}

function removeFromCart(el) {
    cart = remove(cart, el);
    switchTab("#cart");
} 

function remove(arr, el) {
    let new_arr = [];
    for (const e of arr) {
        if(el != e) {
            new_arr.push(e);
        }
    }
    return new_arr;
}

$("#main_cart_checkout").click( function() {
    if(isUserLoged()) {
        $("#main_cart_modal_checkout").modal('show');
    } else {
        userLogin();
    }
});

$("#main_cart_modal_checkout button").click( function() {
    if($("input#form_checkout_name").val() && $("input#form_checkout_tel").val()) {
        var data = {
            email : getCookie("email"),
            books : cart,
            name : $("input#form_checkout_name").val(),
            tel : $("input#form_checkout_tel").val()
        }
        sendRequest("createOrder", data, function(data) {
            $("#main_cart_modal_checkout").modal('hide');
            toastr.success("Ваш заказ принят! Мы с вами свяжемся в ближайшее время! Номер заказа: "+data[0]);
            cart = [];
            switchTab("#cart");
        }, function(data) {
            toastr.error(data['err'][0]);
        })
    } else {
        $("#main_cart_modal_checkout input").removeClass("empty");
        $("#main_cart_modal_checkout input:empty").addClass("empty");
        toastr.error("Введите все поля!");
    }
});