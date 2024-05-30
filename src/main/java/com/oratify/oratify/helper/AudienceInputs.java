package com.oratify.oratify.helper;

import com.oratify.oratify.inmem.AnswersInMem;
import com.oratify.oratify.inmem.QuestionsInMem;
import com.oratify.oratify.model.answers.SessionAnswerQuestionResponse;
import com.oratify.oratify.model.questions.SessionQuestionCurrResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class AudienceInputs {
    public static final String INPUT = "input";
    public static final String ANSWER = "answer";
    private static final Logger logger = LoggerFactory.getLogger(AudienceInputs.class);
    private final AnswersInMem answersInMem;
    private final QuestionsInMem questionsInMem;

    @Autowired
    public AudienceInputs(AnswersInMem answersInMem, QuestionsInMem questionsInMem) {
        this.answersInMem = answersInMem;
        this.questionsInMem = questionsInMem;
    }

    public String extractAudienceTextInput() {
        logger.info("extractAudienceTextInput");

        // Filter and group answers by question ID
        Map<Long, List<String>> groupedAnswers = answersInMem.getSessionAnswerQuestionResponseList().stream()
                .filter(response -> INPUT.equals(response.getQuestion_type()) && ANSWER.equals(response.getQuestion_target()))
                .collect(Collectors.groupingBy(
                        SessionAnswerQuestionResponse::getQuestion_id,
                        Collectors.mapping(SessionAnswerQuestionResponse::getAnswer, Collectors.toList())
                ));

        // Build the final string
        StringBuilder result = new StringBuilder();

        for (Map.Entry<Long, List<String>> entry : groupedAnswers.entrySet()) {
            Long questionId = entry.getKey();
            List<String> answers = entry.getValue();

            // Retrieve the question text for the current question ID
            String questionText = questionsInMem.getSessionQuestionCurrResponseList().stream()
                    .filter(q -> q.getId().equals(questionId))
                    .map(SessionQuestionCurrResponse::getQuestion)
                    .findFirst()
                    .orElse("Unknown Question");

            // Append the question and its answers to the result
            result.append("<<").append(questionText).append(">>\n\n");
            answers.forEach(answer -> result.append(answer).append("\n\n"));
        }

        return result.toString();
    }

}
