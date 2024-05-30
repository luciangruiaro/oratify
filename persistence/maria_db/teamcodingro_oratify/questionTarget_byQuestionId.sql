create
    definer = teamcodingro_oratify@`%` function questionTarget_byQuestionId(paramQuestionId int) returns varchar(128)
    RETURN (SELECT target from questions where id = paramQuestionId);

