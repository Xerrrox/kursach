function checkAuth() {
    if(!getCookie("email") || !getCookie("session")) {
        userLogin();
    } else {
        userCheck();
    }
}

function isUserLoged() {
    let res = false;
    if(getCookie("email") && getCookie("session")) {
        var data = {
            "email" : getCookie("email"),
            "session" : getCookie("session")
        }
        sendRequest("userCheck", data, function(data) {
            if(data[0]['status'] == 'valid') {
                res = true;
            }
        });
    }
    return res;
}

function userLogin() {
    $(".modal").modal("hide");
    $("#main_profile_modal_login").modal("show");
}

function userReg() {
    $(".modal").modal("hide");
    $("#main_profile_modal_reg").modal("show");
}

function userCheck() {
    var data = {
        "email" : getCookie("email"),
        "session" : getCookie("session")
    }
    sendRequest("userCheck", data, function(data) {
        if(data[0]['status'] != 'valid') {
            userLogin();
        } else {
			$("#main_profile_email").html(getCookie('email'));
        }
    });
}

$("#main_profile_modal_login button").click( function() {
    var data = {
        "email" : $("input#form_login_email").val(),
        "pass" : $("input#form_login_password").val()
    }
    
    if($("input#form_login_email").val() && $("input#form_login_password").val()) {
        sendRequest("userLogin", data, function(data) {
            deleteCookie("email");
            deleteCookie("session");
            setCookie("email", $("input#form_login_email").val(), {
                expires: ($("input#form_login_remember").is(':checked') ? 604800 : 0)
            })
            setCookie("session", data[0]['hash'], {
                expires: ($("input#form_login_remember").is(':checked') ? 604800 : 0)
            })
            $("#main_profile_modal_login").modal('hide');
            toastr.success("Вы успешно авторизировались!");
        }, function(data) {
            toastr.error(data['err'][0]);
        });
    } else {
        $("#main_profile_modal_login input").removeClass("empty");
        $("#main_profile_modal_login input:empty").addClass("empty");
        toastr.error("Надо заполнить все поля!");
    }
});

$("#main_profile_modal_reg button").click( function() {
    var data = {
        "email" : $("input#form_reg_email").val(),
        "pass" : $("input#form_reg_password").val()
    }
    if($("input#form_reg_email").val() && $("input#form_reg_password").val() && $("input#form_reg_password_rep").val()) {
        if($("input#form_reg_password").val() == $("input#form_reg_password_rep").val()) {
            sendRequest("userCreate", data, function(data) {
                deleteCookie("email");
                deleteCookie("session");
                setCookie("email", $("input#form_reg_email").val(), {
                    expires: ($("input#form_reg_remember").is(':checked') ? 604800 : 0)
                })
                setCookie("session", data[0]['hash'], {
                    expires: ($("input#form_reg_remember").is(':checked') ? 604800 : 0)
                })
                $("#main_profile_modal_reg").modal('hide');
                toastr.success("Вы успешно зарегистрировались!");
            }, function(data) {
                toastr.error(data['err'][0]);
            });
        } else {
            toastr.error("Пароли не совпадают!");
        }
    } else {
        $("#main_profile_modal_reg input").removeClass("empty");
        $("#main_profile_modal_reg input:empty").addClass("empty");
        toastr.error("Надо заполнить все поля!");
    }
});

$("button#main_profile_save").click( function() {
    var data = {
        "email" : getCookie("email"),
        "oldpass" : $("input#main_profile_oldpass").val(),
        "newpass" : $("input#main_profile_newpass").val()
    }

    if($("input#main_profile_newpass").val() == $("input#main_profile_newpass_rep").val()) {
        sendRequest("changePassword", data, function(data) {
            toastr.success("Пароль изменен!");
        }, function(data) {
            toastr.error(data['err'][0]);
        });
    } else {
        toastr.error("Пароли не совпадают!");
    }
});