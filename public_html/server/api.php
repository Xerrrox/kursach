<?php

    require_once 'functions.php';

    $res = array('data' => [], 'err' => []);
    $functions = new Functions; //обьект класса

    if((isset($_GET['function']) && isset($_GET['data']))) {
        $GLOBALS['data'] = $_GET['data'] ?? $_POST['data'] ?? null;
        try {
            switch($_GET['function']) {
                case 'getMenuSections' :
                    array_push($res['data'], $functions->getMenuSections());
                    break;
                case 'getAllMenuSections' :
                    array_push($res['data'], $functions->getAllMenuSections());
                    break;
                case 'getLastBooks' :
                    array_push($res['data'], $functions->getLastBooks());
                    break;
                case 'getRandBooks' :
                    array_push($res['data'], $functions->getRandBooks());
                    break;
                case 'getBookInfo' :
                    array_push($res['data'], $functions->getBookInfo());
                    break;
                case 'getBooksInfo' :
                    array_push($res['data'], $functions->getBooksInfo());
                    break;
                case 'searchBooks' :
                    array_push($res['data'], $functions->searchBooks());
                    break;
                case 'userLogin' :
                    array_push($res['data'], $functions->userLogin());
                    break;
                case 'userCheck' :
                    array_push($res['data'], $functions->userCheck());
                    break;
                case 'userCreate' :
                    array_push($res['data'], $functions->userCreate());
                    break;
                case 'changePassword' :
                    array_push($res['data'], $functions->changePassword());
                    break;
                case 'createOrder' :
                    array_push($res['data'], $functions->createOrder());
                    break;
                default :
                    array_push($res['err'], "Unknown function");
                    break;
            }
        } catch (Exception $e) {
            array_push($res['err'], $e->getMessage());
        }
        array_push($res['err'], $GLOBALS['database'] -> error()[2]); 
        array_push($res['err'], $GLOBALS['database'] -> last()); //возвращает последний запрос
    }

    echo json_encode($res);
?>