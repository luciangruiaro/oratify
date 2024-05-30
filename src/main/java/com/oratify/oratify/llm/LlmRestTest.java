package com.oratify.oratify.llm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LlmRestTest {
    private final CB cb;

    @Autowired
    public LlmRestTest(CB cb) {
        this.cb = cb;
    }

    @GetMapping("/llm/prompt")
    public ResponseEntity generate() {
        return ResponseEntity.ok(cb.generate("Tell me something about Romania. Limit your response to 100 tokens"));
    }
}
