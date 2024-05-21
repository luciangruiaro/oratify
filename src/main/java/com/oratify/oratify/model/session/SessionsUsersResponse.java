package com.oratify.oratify.model.session;

import lombok.Data;

@Data
public class SessionsUsersResponse {
    private int presentation_id;
    private int user_id;
    private String join_time;
    private int id;
    private String first_name;
    private String last_name;
    private String email;
    private String birth_date;
    private String created_time;
}
