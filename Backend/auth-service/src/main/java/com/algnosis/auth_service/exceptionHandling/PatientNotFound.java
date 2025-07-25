package com.algnosis.auth_service.exceptionHandling;

public class PatientNotFound extends RuntimeException{
    private String msg;

    public PatientNotFound(String msg){
        super(msg);
    }
}
