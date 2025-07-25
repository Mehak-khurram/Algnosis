package com.algnosis.auth_service.exceptionHandling;

public class DoctorNotFound extends RuntimeException{
    private String msg;

    public DoctorNotFound(String msg){
        this.msg = msg;
    }
}
