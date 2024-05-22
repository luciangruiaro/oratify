package com.oratify.oratify.rest;

import com.oratify.oratify.model.presentation.PresentationCurrSetRequest;
import com.oratify.oratify.model.presentation.PresentationCurrentResponse;
import com.oratify.oratify.model.presentation.PresentationPlayRequest;
import com.oratify.oratify.model.session.PresentationRemainingTimeResponse;
import com.oratify.oratify.persistency.DbQ;
import com.oratify.oratify.response.SuccessResponse;
import com.oratify.oratify.service.QuestionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class SessionController {
    private final DbQ dbQ;
    private final QuestionsService questionsService;

    @Autowired
    public SessionController(DbQ dbQ, QuestionsService questionsService) {
        this.dbQ = dbQ;
        this.questionsService = questionsService;
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
            dbQ.executeQuery(query, null);

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
            results = dbQ.executeQuery(query, targetClasses);
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
            dbQ.executeQuery(query, null);

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
            results = dbQ.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(results.get(0));
    }


}
