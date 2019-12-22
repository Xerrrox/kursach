<?php
    require_once 'Medoo.php';
    require_once 'books.php';
    require_once 'genres.php';
    require_once 'sessions.php';
    require_once 'users.php';
    require_once 'orders.php';
    require_once 'carts.php';

    use Medoo\Medoo;

    class Functions {

        function __construct() { //конструктор где я подкл к бд
            $db = new Medoo([
                // required
                'database_type' => 'mysql',
                'database_name' => 'BookStore',
                'server' => 'localhost:3306',
                'username' => 'root',
                'password' => '',
                'charset' => 'utf8'
            ]);

            $GLOBALS['database'] = $db;
        }

        public function getMenuSections() { //паблики - область видимости //стили жанров и его подстили
            $where['root'] = $GLOBALS['data']['root'];
            return Genres::select("*", $where);
        }

        public function getAllMenuSections() { //возвраащает все в иерархии
            $genres = Genres::select("*");
            $res = [];
            foreach ($genres as $el) {
                if($el['root'] == 0) {
                    $res[$el['id']]['name'] = $el['name'];
                } else {
                    $res[$el['root']]['subgenre'][$el['id']] = $el['name'];
                }
            }
            return $res;
        }

        public function getLastBooks() { //последние книги какие были добавлены 
            $id = $GLOBALS['data']['root'];
            $columns = [
                "books.id",
                "books.title",
                "books.author_id",
                "books.price",
                "books.cover",
                "books.genre_id",
                "genres.root",
                "authors.name(author_name)"
            ];
            $where = array(
                'ORDER' => ["books.id" => "DESC"],
                'LIMIT' => "4"
            );
            $join = [
                "[>]authors" => ["author_id" => "id"],
                "[>]genres" => ["genre_id" => "id"]
            ];
            if($id != 0) {
                $where["OR"] = [
                    "genre_id" => $id,
                    "root" => $id
                ];
            }

            return Books::select($columns, $where, $join);
        }

        public function getRandBooks() { 
            $id = $GLOBALS['data']['root'];
            $columns = [
                "books.id",
                "books.title",
                "books.author_id",
                "books.price",
                "books.cover",
                "books.genre_id",
                "genres.root",
                "authors.name(author_name)"
            ];
            $where = array(
                'LIMIT' => "4"
            );
            $join = [
                "[>]authors" => ["author_id" => "id"],
                "[>]genres" => ["genre_id" => "id"]
            ];
            if($id != 0) {
                $where["OR"] = [
                    "genre_id" => $id,
                    "root" => $id
                ];
            }

            return Books::rand($columns, $where, $join);
        }

        public function getBookInfo() { //вся информация касательно книги
            $id = intval($GLOBALS['data']['book']);
            $columns = [
                "books.id",
                "books.title",
                "books.author_id",
                "books.language",
                "books.year",
                "books.pages",
                "books.isbn",
                "books.price",
                "books.cover",
                "books.genre_id",
                "authors.name(author_name)",
                "genres.name(genre_name)"
            ];
            $where = array(
                "books.id" => $id
            );
            $join = [
                "[>]authors" => ["author_id" => "id"],
                "[>]genres" => ["genre_id" => "id"]
            ];
            return Books::select($columns, $where, $join);
        }

        public function getBooksInfo() { //информация по всем книгам (по карточкам)
            $id = $GLOBALS['data']['books'];
            $columns = [
                "books.id",
                "books.title",
                "books.author_id",
                "books.price",
                "authors.name(author_name)"
            ];
            $where = array(
                "OR" => [
                    "books.id" => $id
                ]
            );
            $join = [
                "[>]authors" => ["author_id" => "id"],
                "[>]genres" => ["genre_id" => "id"]
            ];
            return Books::select($columns, $where, $join);
        }

        public function searchBooks() { //поиск книг
            $q = $GLOBALS['data']['query'];
            $columns = [
                "books.id",
                "books.title",
                "books.author_id",
                "books.price",
                "books.cover",
                "books.genre_id",
                "authors.name(author_name)"
            ];
            $where = array(
                "OR" => [
                    "books.title[~]" => $q,
                    "authors.name[~]" => $q
                ]
            );
            $join = [
                "[>]authors" => ["author_id" => "id"]
            ];
            return Books::select($columns, $where, $join);
        }

        public function userCreate() { //регестрация
            $data['email'] = $GLOBALS['data']['email'];
            $data['password'] = hash('sha256', $GLOBALS['data']['pass']);
            $id = Users::insert($data);
            return self::userLogin();
        }

        public function userLogin() { //авторизация
            $where['email'] = $GLOBALS['data']['email'];
            $info = Users::select("*", $where);
            if($info) {
                if(hash('sha256', $GLOBALS['data']['pass']) == $info[0]['password']) {
                    $hash = hash('sha256', ($info[0]['email'].time().$info[0]['password']));
                    $data['user_id'] = $info[0]['id'];
                    $data['datetime'] = date('Y-m-d H:i:s');
                    $data['hash'] = $hash;
                    $id = Sessions::insert($data);
                    return array("hash" => $id.':'.$hash);
                } else {
                    throw new Exception('Неверный пароль!');
                }
            } else {
                throw new Exception('Такого пользователя нет!');
            }
        }

        public function userCheck() { //валидна ли сессия?
            $where['email'] = $GLOBALS['data']['email'];
            $id = Users::select("id", $where);
            if(preg_match("#^[0-9]+:[aA-zZ0-9]{64}$#", $GLOBALS['data']['session']) && $id[0]) {
                $columns = ["id", "hash"];
                unset($where);
                $where['user_id'] = $id[0];
                $where['ORDER'] = ["id" => "DESC"];
                $where['LIMIT'] = 1;
                $res = Sessions::select($columns, $where);
                if($GLOBALS['data']['session'] == $res[0]['id'].':'.$res[0]['hash']) {
                    return array("status" => 'valid');
                }
            }
            return array("status" => 'invalid');
        }

        public function changePassword() { //меняем пароль
            $where['email'] = $GLOBALS['data']['email'];
            $oldpass = $GLOBALS['data']['oldpass'];
            $data['password'] = hash('sha256', $GLOBALS['data']['newpass']);
            $id = Users::select(["id", "password"], $where);
            if($id[0]['password'] == hash('sha256', $oldpass)) {
                Users::update($data, $where);
            } else {
                throw new Exception('Неверный пароль!');
            }
        }

        public function createOrder() { //созданием заказа
            $where['email'] = $GLOBALS['data']['email'];
            $data['user_id'] = Users::select("id", $where)[0];
            $data['datetime'] = date("Y-m-d H:i:s");
            $data['telephone'] = $GLOBALS['data']['tel'];
            $data['name'] = $GLOBALS['data']['name'];
            $order_id = Orders::insert($data);
            $data = [];
            $data['order_id'] = $order_id;
            foreach ($GLOBALS['data']['books'] as $book) {
                $data['book_id'] = intval($book);
                Carts::insert($data);
            }
            return $data['order_id'];
        }
    }
?>