create
    definer = teamcodingro_oratify@`%` procedure user_edit(IN paramUserId int, IN paramUpdatedField varchar(128),
                                                           IN paramUpdatedValue varchar(512))
BEGIN
    SET @s = CONCAT('UPDATE users SET ', paramUpdatedField, ' = ? WHERE id = ?');

    PREPARE stmt FROM @s;
    SET @value = paramUpdatedValue;
    SET @userId = paramUserId;
    EXECUTE stmt USING @value, @userId;
    DEALLOCATE PREPARE stmt;
END;

