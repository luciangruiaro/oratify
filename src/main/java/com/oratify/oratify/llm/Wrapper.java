package com.oratify.oratify.llm;

import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class Wrapper {
    private final OpenAiChatClient chatClient;

    @Autowired
    public Wrapper(OpenAiChatClient chatClient) {
        this.chatClient = chatClient;
    }

    public String generatePromptResponse(String prompt) {
        return Map.of("generation", chatClient.call(prompt)).get("generation");
    }

}
