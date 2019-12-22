delimiter // 
create trigger order_insert after insert on `orders` for each row begin
    update `users` set `name` = NEW.`name`, `telephone` = NEW.`telephone` where `id` = NEW.`user_id`;
end;//
delimiter ;