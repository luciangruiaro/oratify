package com.oratify.oratify.helper;

public class SuccessResponse {
    private boolean success;
    private String generation;

    public SuccessResponse(boolean success, String generation) {
        this.success = success;
        this.generation = generation;
    }

    public SuccessResponse(boolean success) {
        this.success = success;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getGeneration() {
        return generation;
    }

    public void setGeneration(String generation) {
        this.generation = generation;
    }
}
