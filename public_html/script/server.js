function sendRequest(func, data, callback = null, errorcallback = null) { //описываю все что происходит в sendrequest
    var req = {
        "function" : func,
        "data" : data
    }
    $.ajax({
        url : "server/api.php",
        method : "GET",
        async : false,
        dataType : "json",
        data : req,
        error : function(data) {
            console.log(data);
        },
        success : function(data) {
            if(data['err'][0]) {
                if(errorcallback) errorcallback(data);
            } else {
                if(callback) callback(data['data']);
            }
        }
    });
}