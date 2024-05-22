package com.oratify.oratify.persistency;

import com.oratify.oratify.model.session.SessionsUsersResponse;
import com.oratify.oratify.model.user.UserJoinResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsersPersistent {
    public static final String CALL_SESSIONS_USERS_S = "call sessions_users(%s)";
    public static final String CALL_USER_JOIN_S_S_S = "call user_join('%s', '%s', '%s')";
    private static final Logger logger = LoggerFactory.getLogger(QuestionsPersistent.class);
    private final DbQ dbQ;

    @Autowired
    public UsersPersistent(DbQ dbQ) {
        this.dbQ = dbQ;
    }

    public List<SessionsUsersResponse> getSessionsUsersFromPersistent(int presentationId) {
        String query = String.format(CALL_SESSIONS_USERS_S, presentationId);
        List<Class<?>> targetClasses = List.of(SessionsUsersResponse.class);
        List<Object> results;
        try {
            results = dbQ.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return results.stream().filter(SessionsUsersResponse.class::isInstance).map(SessionsUsersResponse.class::cast).collect(Collectors.toList());
    }

    public UserJoinResponse userJoin(String presentationCode, String firstName, String lastName) {
        String query = String.format(CALL_USER_JOIN_S_S_S, presentationCode, firstName, lastName);
        List<Class<?>> targetClasses = List.of(UserJoinResponse.class);
        List<Object> results = new ArrayList<>();
        try {
            results = dbQ.executeQuery(query, targetClasses);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return (UserJoinResponse) results.get(0);
    }
}
