package com.oratify.oratify.model.user;

import lombok.Data;

@Data
public class UserJoinRequest {

    private String presentation_code;
    private String first_name;
    private String last_name;


}
