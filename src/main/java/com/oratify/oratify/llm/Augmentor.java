package com.oratify.oratify.llm;

public class Augmentor {
    private String context;
    private String instructions;

    public Augmentor(String context, String instructions) {
        this.context = context;
        this.instructions = instructions;
    }

    public String augmentInput(String inputs) {
        return String.format("Instructions:%n%s%n%nContext:%n%s%n%nInputs:%n%s", instructions, context, inputs);
    }

    public String augmentInput(String userMessage, String initialTopic) {
        return String.format("Initial Topic:%n%s%n%nUser Message:%n%s%n%nContext:%n%s%n%nInstructions:%n%s", initialTopic, userMessage, context, instructions);
    }
}

