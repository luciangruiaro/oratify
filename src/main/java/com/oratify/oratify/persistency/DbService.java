package com.oratify.oratify.persistency;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oratify.oratify.config.DataSource;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service

public class DbService {
    private final DataSource dataSource;
    private final ObjectMapper objectMapper;

    public DbService(DataSource dataSource, ObjectMapper objectMapper) {
        this.dataSource = dataSource;
        this.objectMapper = objectMapper;
    }

    public List<Object> executeQuery(String query, List<Class<?>> targetClasses) throws SQLException {
        List<Object> results = new ArrayList<>();

        try (Connection connection = DriverManager.getConnection(dataSource.getDbUrl(), dataSource.getUser(), dataSource.getPassword()); PreparedStatement stmt = connection.prepareStatement(query)) {
            // Execute query
            boolean isResultSet = stmt.execute();
            int resultSetIndex = 0;
            while (isResultSet) {
                if (resultSetIndex >= targetClasses.size()) {
                    throw new IllegalArgumentException("More result sets than target classes provided.");
                }
                Class<?> targetClass = targetClasses.get(resultSetIndex);
                try (ResultSet rs = stmt.getResultSet()) {
                    ResultSetMetaData metaData = rs.getMetaData();
                    int columnCount = metaData.getColumnCount();
                    while (rs.next()) {
                        Object targetObject = targetClass.getDeclaredConstructor().newInstance();
                        for (int i = 1; i <= columnCount; i++) {
                            String columnName = metaData.getColumnName(i);
                            Object columnValue = rs.getObject(i);
                            if (columnValue != null) {
                                Field field = getField(targetClass, columnName);
                                if (field != null) {
                                    Class<?> fieldType = field.getType();
                                    Object mappedValue = objectMapper.convertValue(columnValue, fieldType);
                                    BeanUtils.setProperty(targetObject, columnName, mappedValue);
                                }
                            }
                        }
                        results.add(targetObject);
                    }
                }
                isResultSet = stmt.getMoreResults();
                resultSetIndex++;
            }
        } catch (SQLException | ReflectiveOperationException e) {
            e.printStackTrace();
            throw new SQLException("Error executing query", e);
        }
        return results;
    }

    private Field getField(Class<?> targetClass, String fieldName) {
        try {
            return targetClass.getDeclaredField(fieldName);
        } catch (NoSuchFieldException e) {
            // Handle case where the field might be in a superclass
            Class<?> superclass = targetClass.getSuperclass();
            if (superclass != null) {
                try {
                    return superclass.getDeclaredField(fieldName);
                } catch (NoSuchFieldException ex) {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}
