package com.oratify.oratify.model.questions;

import lombok.Data;

@Data
public class SessionQuestionCurrResponse {

    private Long id;
    private Long presentation_id;
    private int priority;
    private String question;
    private String type;
    private String options;
    private String target;
    private String slideText;
}