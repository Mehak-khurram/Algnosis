package com.algnosis.auth_service.exceptionHandling;

import lombok.Data;

@Data
public class DoctorNotFound extends RuntimeException{
    private String msg;

    public DoctorNotFound(String msg){
        super(msg);
    }
}
