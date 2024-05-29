package com.oratify.oratify.llm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import static com.oratify.oratify.llm.Contexts.ANALYZER;
import static com.oratify.oratify.llm.Contexts.GENERAL_PROMPT;
import static com.oratify.oratify.llm.Instructions.*;

@Component
public class PromptProcessor {
    private static final Logger logger = LoggerFactory.getLogger(CB.class);


    public String buildMetapromptGeneral(String prompt, String initialTopic) {
        logger.info("processPrompt, prompt: {}", prompt);
        Augmentor augmentor = new Augmentor(GENERAL_PROMPT, IMPERSONATION_DEFINITION);
        return augmentor.augmentInput(prompt, initialTopic);
    }

    public String buildMetapromptSummary(String input) {
        logger.info("processPrompt, input: {}", input);
        Augmentor augmentor = new Augmentor(ANALYZER, SUMMARY_GENERATOR);
        return augmentor.augmentInput(input);
    }

    public String buildMetapromptMainTopics(String input) {
        logger.info("processPrompt, input: {}", input);
        Augmentor augmentor = new Augmentor(ANALYZER, MAIN_TOPICS_IDENTIFIER);
        return augmentor.augmentInput(input);
    }

    public String buildMetapromptConclusions(String input) {
        logger.info("processPrompt, input: {}", input);
        Augmentor augmentor = new Augmentor(ANALYZER, CONCLUSION_BUILDER);
        return augmentor.augmentInput(input);
    }


}
