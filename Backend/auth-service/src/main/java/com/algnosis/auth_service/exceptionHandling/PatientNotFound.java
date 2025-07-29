package com.algnosis.auth_service.exceptionHandling;

import lombok.Data;

@Data
public class PatientNotFound extends RuntimeException{
    private String msg;

    public PatientNotFound(String msg){
        super(msg);
    }
}
