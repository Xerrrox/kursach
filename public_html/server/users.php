<?php
    require_once 'Medoo.php';

    use Medoo\Medoo;

    class Users {
        const TABLE_NAME = "users";

        public static function delete() {}

        public static function insert($data) {
            $GLOBALS['database']->insert(self::TABLE_NAME, $data);
            return $GLOBALS['database']->id();
        }

        public static function select($columns, $where = "1", $join = null) {
            if($join == []) {
                return $GLOBALS['database']->select(self::TABLE_NAME, $columns, $where);
            } else {
                return $GLOBALS['database']->select(self::TABLE_NAME, $join, $columns, $where);
            }
        }

        public static function update($data, $where) {
            return $GLOBALS['database']->update(self::TABLE_NAME, $data, $where);
        }
    }
?>