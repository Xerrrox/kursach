function onTabSwitched(newtab) { //все по кейсам смотри
   	switch(newtab) {
		case "#home" :
			var params = {
				'root' : 0 //загружаю все 
			}
			sendRequest("getRandBooks", params, function(data) { 
				if(!data[0].length) $("#home_recomendation").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						appendBook("#home_recomendation", el);
					}
				}
			});
		
			sendRequest("getLastBooks", params, function(data) {
				if(!data[0].length) $("#home_last").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						appendBook("#home_last", el);
					}
				}
			});
			break;
        case "#genre" :
            var params = {
               'root' : id
            }
            sendRequest("getMenuSections", params, function(data) {
				$("#main_genre_subgenres").empty();
				if(data[0].length) $("#main_genre_subgenres").append('<ul class="nav nav-pills justify-content-between special-color my-2"></ul>')
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						var html = '<li class="nav-item mx-3"><a class="text-white text-capitalize menu-tab" menu-tab-title="'+el.name+
								'" onclick="linkClicked(this);" href="#genre_'+el.id+
								'">'+el.name+
								'</a></li>';
						$("#main_genre_subgenres > ul").append(html);
					}
				}
            });

			sendRequest("getRandBooks", params, function(data) {
				$("#main_genre_recomendation").empty();
				if(!data[0].length) $("#main_genre_recomendation").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						appendBook("#main_genre_recomendation", el);
					}
				}
			});

			sendRequest("getLastBooks", params, function(data) {
				$("#main_genre_last").empty();
				if(!data[0].length) $("#main_genre_last").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						appendBook("#main_genre_last", el);
					}
				}
			});
            break;
        case "#book" :
			var params = {
				'book' : id
			}
			sendRequest("getBookInfo", params, function(data) {
				$("#book").empty();
				el = data[0][0];
				var html = '<div class="row mb-4"><div class="col-3 offset-2"><img class="w-100" src="img/books/'+el.cover+
							'" alt=""></div><div class="col-5"><h3 class="font-weight-bold">'+el.title+
							'</h3><h4 class="grey-text">'+el.author_name+
							'</h4><br><h5 class="strong font-weight-bold">'+parseFloat(el.price).toFixed(2)+
							' грн</h5><button class="btn btn-success ml-0 waves-effect" onclick="addToCart(this);">Добавить в корзину</button></div></div><div class="row mt-4"><div class="col-8 offset-2">'+
							'<h5 class="h5">Характеристики</h5><table class="table table-borderless"><tbody><tr><td>ID</td><td>'+el.id+
							'</td></tr><tr><td>Название</td><td>'+el.title+
							'</td></tr><tr><td>Автор</td><td>'+el.author_name+
							'</td></tr><tr><td>Жанр</td><td class="text-capitalize">'+el.genre_name+
							'</td></tr><tr><td>Год издания</td><td>'+el.year+
							'</td></tr><tr><td>Кол-во страниц</td><td>'+el.pages+
							'</td></tr><tr><td>Язык</td><td>'+el.language+
							'</td></tr><tr><td>ISBN</td><td>'+el.isbn+
							'</td></tr></tbody></table></div></div>'
				$("#book").append(html);
			});
			break;
		case "#search" :
			var param = {
				'query' : $("input[name='q']").val()
			}
			sendRequest("searchBooks", param, function(data) {
				$("#main_search_content").empty();
				if(!data[0].length) $("#main_search_content").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
				for (const key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						const el = data[0][key];
						appendBook("#main_search_content", el);
					}
				}
			});
			break;
		case "#cart" :
			if(cart.length) {
				var params = {
					'books' : cart
				}
				sendRequest("getBooksInfo", params, function(data) {
					var total = 0.0;
					$("#main_cart_content").empty();
					if(!data[0].length) $("#main_cart_content").html("<div class='col-12'><h4 class='h4 my-2 text-center'>Упс! Тут ничего нет(</h4></div>");
					var html = '<table class="table table-borderless"><tbody>'
					for (const key in data[0]) {
						if (data[0].hasOwnProperty(key)) {
							const el = data[0][key];
							total += parseFloat(el.price)
							html += '<tr><td>'+el.id+
									'</td><td>'+el.title+
									'</td><td>'+el.author_name+
									'</td><td>'+parseFloat(el.price).toFixed(2)+
									' грн.</td><td><a onclick="removeFromCart('+el.id+
									');"><i class="fa fa-times" ></i></a></td></tr>'
						}
					}
					html += '</tbody><tfoot><tr><td colspan="3" class="text-right font-weight-bold">'+
							'Итого:</td><td colspan="2" class="font-weight-bold">'+parseFloat(total).toFixed(2)+
							' грн.</td></tr></tfoot></table>'
					$("#main_cart_content").append(html);
				});
				$("#main_cart_checkout").fadeIn();
			} else {
				$("#main_cart_checkout").hide();
				$("#main_cart_content").html('<p class="mt-4 text-center">Тут пока ничего нет, но никогда не поздно это исправить!</p>');
			}
			break;
		case "#profile" :
			checkAuth();
			break;
   }
}