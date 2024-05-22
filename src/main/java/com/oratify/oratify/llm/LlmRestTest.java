package com.oratify.oratify.llm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LlmRestTest {
    private final Wrapper wrapper;

    @Autowired
    public LlmRestTest(Wrapper wrapper) {
        this.wrapper = wrapper;
    }

    @GetMapping("/llm/prompt")
    public ResponseEntity generate() {
        return ResponseEntity.ok(wrapper.generatePromptResponse("Tell me something about Romania. Limit your response to 100 tokens"));
    }
}
