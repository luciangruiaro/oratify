package com.oratify.oratify.model.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserJoinResponse {
    private int presentationId;
    @JsonProperty("userId")
    private int newUserId;

}
