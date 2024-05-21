package com.oratify.oratify.model.presentation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PresentationCurrentResponse {
    @JsonProperty("presentation_id")
    private int aux;
}
