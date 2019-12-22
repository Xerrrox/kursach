$(document).ready(function() {
    var params = {
        'root' : 0
    }
    sendRequest("getMenuSections", params, function(data) { //для хэддера
        for (const key in data[0]) {
            if (data[0].hasOwnProperty(key)) {
                const el = data[0][key];
                var html = '<h4 class="text-uppercase mx-2"><a class="text-white menu-tab" menu-tab-title="'+el.name+
                        '" onclick="linkClicked(this);" href="#genre_'+el.id+
                        '">'+el.name+
                        '</a></h4>';
                $("#header_menu").append(html);
                html = '<li class="nav-item active"><a class="text-white menu-tab" menu-tab-title="'+el.name+
                        '" onclick="linkClicked(this);" href="#genre_'+el.id+
                        '">'+el.name+
                        '</a></li>';
                $("#navbarSupportedContent1 > ul").append(html);
            }
        }
    });

    sendRequest("getAllMenuSections", null, function(data) { //для футтера
        for (const key in data[0]) {
            const el = data[0][key];
            var html = '<div class="col-sm-6 col-md-3 mb-md-0 mb-3"><h5 class="text-uppercase text-center"><a class="menu-tab" menu-tab-title="'+el.name+
                        '" onclick="linkClicked(this);" href="#genre_'+key+
                        '">'+el.name;
            if(Object.keys(el.subgenre).length > 6) {
                html += '</h5><ul class="list-unstyled text-center" style="columns: 2;">'
            } else {
                html += '</h5><ul class="list-unstyled text-center">'
            }
            for (const id in el.subgenre) {
                const sub = el.subgenre[id];
                html += '<li><a class="menu-tab" menu-tab-title="'+sub+'" onclick="linkClicked(this);" href="#genre_'+id+'">'+sub+'</a></li>'
            }
            html += '</ul>'
            $("#footer_menu").append(html);
        }
    });

    $("form[name='search_form']").submit(function(e) { //для формы поиска, что происходит
        e.preventDefault(); //убирает стандартное поведение (если не будет, то при отправке формы страница перезагрузится)
        switchTab("#search"); //на вкладку серч
    });
});

function appendBook(root, book) { //формирую карточку книги, отдельная функция чтобы постоянно не писать
    var html = '<div class="col-sm-6 col-md-4 col-lg-3"><div class="card align-items-center px-4 pt-4 my-2"><div class="view overlay"><img src="img/books/'+book.cover+
                '" class="card-img-top" alt="'+book.title+
                '"><a class="menu-tab" menu-tab-title="'+book.title+
                '" onclick="linkClicked(this);" onclick="linkClicked(this);" href="#book_'+book.id+
                '"><div class="mask rgba-white-slight"></div></a></div><div class="card-body text-center px-0 w-100"><h6 class="grey-text" title="'+book.author_name+
                '">'+book.author_name+
                '</h6><h6><strong><a class="dark-grey-text menu-tab" menu-tab-title="'+book.title+
                '" onclick="linkClicked(this);" href="#book_'+book.id+
                '" title="'+book.title+
                '">'+book.title+
                '</a></strong></h6><h5 class="font-weight-bold blue-text"><strong>'+parseFloat(book.price).toFixed(2)+
                ' грн</strong></h5></div></div></div>'
    $(root).append(html);
}