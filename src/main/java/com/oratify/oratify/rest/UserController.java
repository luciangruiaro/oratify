package com.oratify.oratify.rest;

import com.oratify.oratify.model.user.UserJoinRequest;
import com.oratify.oratify.model.user.UserJoinResponse;
import com.oratify.oratify.persistency.DbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
public class UserController {

    private final DbService dbService;

    @Autowired
    public UserController(DbService dbService) {
        this.dbService = dbService;
    }

    @PostMapping("/user_join") // DONE
    public ResponseEntity userJoin(@RequestBody UserJoinRequest userJoinRequest) {
        // Process the request
        String presentationCode = userJoinRequest.getPresentation_code();
        String firstName = userJoinRequest.getFirst_name();
        String lastName = userJoinRequest.getLast_name();
        // build the query
        String query = String.format("call user_join('%s', '%s', '%s')", presentationCode, firstName, lastName);
        // map response
        List<Class<?>> targetClasses = List.of(UserJoinResponse.class);
        List<Object> results = new ArrayList<>();
        // execute query
        try {
            results = dbService.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(results.get(0));
    }
}
