package com.oratify.oratify.rest;

import com.oratify.oratify.model.presentation.PresentationCurrSetRequest;
import com.oratify.oratify.model.presentation.PresentationCurrentResponse;
import com.oratify.oratify.model.presentation.PresentationPlayRequest;
import com.oratify.oratify.model.session.*;
import com.oratify.oratify.persistency.DbService;
import com.oratify.oratify.response.SuccessResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SessionController {
    private final DbService dbService;

    @Autowired
    public SessionController(DbService dbService) {
        this.dbService = dbService;
    }

    @GetMapping("/session_question_curr") // DONE
    public ResponseEntity getSessionQuestionSet(@RequestParam(value = "presentation_id", defaultValue = "1") String presentation_id) {
        String query = String.format("call session_question_curr(%s)", presentation_id);
        List<Class<?>> targetClasses = List.of(SessionQuestionCurrResponse.class);
        List<Object> results = new ArrayList<>();

        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(results.get(0));
    }

    @PostMapping("/session_question_set")
    public ResponseEntity getSessionQuestionSet(@RequestBody SessionQuestionCurrSetRequest sessionQuestionCurrSetRequest) {
        // Process the request
        int presentation_id = sessionQuestionCurrSetRequest.getPresentation_id();
        int curr_question_id = sessionQuestionCurrSetRequest.getCurr_question_id();
        // build the query
        String query = String.format("call session_question_set(%s, %s)", presentation_id, curr_question_id);
        // map response
        List<Class<?>> targetClasses = List.of(SessionAnswerRequest.class);
        List<Object> results = new ArrayList<>();
        // execute query
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @PostMapping("/answer") // DONE
    public ResponseEntity getSessionQuestionSet(@RequestBody SessionAnswerRequest sessionAnswerRequest) {
        // Process the request
        int user_id = sessionAnswerRequest.getUser_id();
        int presentation_id = sessionAnswerRequest.getPresentation_id();
        int question_id = sessionAnswerRequest.getQuestion_id();
        String answer = sessionAnswerRequest.getAnswer();
        // build the query
        String query = String.format("call answer(%s, %s, %s, '%s')", user_id, presentation_id, question_id, answer);
        // map response
        List<Class<?>> targetClasses = List.of(SessionAnswerRequest.class); // todo null
        List<Object> results = new ArrayList<>();
        // execute query
        try {
            results = dbService.executeQuery(query, targetClasses);

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @GetMapping("/answers_question") // DONE
    public ResponseEntity getAnswersQuestion(@RequestParam(value = "presentation_id", defaultValue = "1") int presentationId, @RequestParam(value = "question_id", defaultValue = "1") int questionId) {
        String query = String.format("call answers_question(%s, %s)", presentationId, questionId);
        List<Class<?>> targetClasses = List.of(SessionAnswersQuestionResponse.class);
        List<Object> results = new ArrayList<>();
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/sessions_users") // DONE
    public ResponseEntity getAnswersQuestion(@RequestParam int presentation_id) {
        String query = String.format("call sessions_users(%s)", presentation_id);
        List<Class<?>> targetClasses = List.of(SessionsUsersResponse.class);
        List<Object> results = new ArrayList<>();
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(results);
    }

    @PostMapping("/presentation_play") // DONE
    public ResponseEntity presentationPlay(@RequestBody PresentationPlayRequest presentationPlayRequest) {
        // Process the request
        int presentation_id = presentationPlayRequest.getPresentation_id();
        int duration = presentationPlayRequest.getDuration();
        // build the query
        String query = String.format("call presentation_play(%s, %s)", presentation_id, duration);
        // execute query
        try {
            dbService.executeQuery(query, null);

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }


    @GetMapping("/presentation_remaining_time") // DONE
    public ResponseEntity getPresentationRemainingTime(@RequestParam int presentation_id) {
        String query = String.format("call presentation_remaining_time(%s)", presentation_id);
        List<Class<?>> targetClasses = List.of(PresentationRemainingTimeResponse.class);
        List<Object> results = new ArrayList<>();
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(results.get(0));
    }

    @PostMapping("/presentation_curr_set") // DONE
    public ResponseEntity setPresentationCurrent(@RequestBody PresentationCurrSetRequest presentationCurrSetRequest) {
        // Process the request
        int presentation_id = presentationCurrSetRequest.getPresentation_id();
        // build the query
        String query = String.format("call presentation_curr_set(%s)", presentation_id);
        // execute query
        try {
            dbService.executeQuery(query, null);

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(new SuccessResponse(true));
    }

    @GetMapping("/presentation_curr_get") // DONE
    public ResponseEntity getPresentationCurrent() {
        String query = String.format("call presentation_curr_get()");
        List<Class<?>> targetClasses = List.of(PresentationCurrentResponse.class);
        List<Object> results = new ArrayList<>();
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(results.get(0));
    }


}
