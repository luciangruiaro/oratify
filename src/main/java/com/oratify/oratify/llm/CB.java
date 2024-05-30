package com.oratify.oratify.llm;

import com.oratify.oratify.helper.AudienceInputs;
import com.oratify.oratify.inmem.QuestionsInMem;
import com.oratify.oratify.model.answers.SessionAnswerRequest;
import com.oratify.oratify.model.questions.SessionQuestionCurrResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CB {
    public static final String GENERATION = "generation";
    public static final String CONCLUSION = "conclusion";
    public static final String SUMMARY = "summary";
    public static final String MAIN_TOPICS = "main-topics";
    private static final Logger logger = LoggerFactory.getLogger(CB.class);
    private final OpenAiChatClient chatClient;
    private final PromptProcessor promptProcessor;
    private final QuestionsInMem questionsInMem;
    private final AudienceInputs audienceInputs;


    @Autowired
    public CB(OpenAiChatClient chatClient, PromptProcessor promptProcessor, QuestionsInMem questionsInMem, AudienceInputs audienceInputs) {
        this.chatClient = chatClient;
        this.promptProcessor = promptProcessor;
        this.questionsInMem = questionsInMem;
        this.audienceInputs = audienceInputs;
    }

    public String generate(String prompt) {
        logger.info("generate, prompt: {}", prompt);
        String response = chatClient.call(prompt);
        logger.info("generate, response: {}", response);
        return Map.of(GENERATION, response).get(GENERATION);
    }

    public String replyWithAI(String prompt, SessionAnswerRequest sessionAnswerRequest) {
        logger.info("replyWithAI, userId: {}, questionId: {}, prompt: {}", sessionAnswerRequest.getUser_id(), sessionAnswerRequest.getQuestion_id(), prompt);
        Optional<String> initialTopicOpt = questionsInMem.getSessionQuestionCurrResponseList().stream()
                .filter(r -> r.getId().equals((long) sessionAnswerRequest.getQuestion_id()))
                .map(SessionQuestionCurrResponse::getQuestion)
                .findFirst();
        String initialTopic = initialTopicOpt.orElse("");
        String response = chatClient.call(promptProcessor.buildMetapromptGeneral(prompt, initialTopic));
        logger.info("replyWithAI, userId: {}, questionId: {}, initialTopic: {}, response: {}", sessionAnswerRequest.getUser_id(), sessionAnswerRequest.getQuestion_id(), initialTopic, response);
        return Map.of(GENERATION, response).get(GENERATION);
    }

    public String analyzeWithAI(String analysisType) {
        logger.info("analyzeWithAI, analysisType: {}", analysisType);

        String prompt;
        switch (analysisType) {
            case CONCLUSION:
                prompt = promptProcessor.buildMetapromptConclusions(audienceInputs.extractAudienceTextInput());
                break;
            case SUMMARY:
                prompt = promptProcessor.buildMetapromptSummary(audienceInputs.extractAudienceTextInput());
                break;
            case MAIN_TOPICS:
                prompt = promptProcessor.buildMetapromptMainTopics(audienceInputs.extractAudienceTextInput());
                break;
            default:
                throw new IllegalArgumentException("Invalid analysisType: " + analysisType);
        }

        String response = chatClient.call(prompt);
        logger.info("analyzeWithAI, analysisType: {}, response: {}", analysisType, response);

        return Map.of(GENERATION, response).get(GENERATION);
    }


}
