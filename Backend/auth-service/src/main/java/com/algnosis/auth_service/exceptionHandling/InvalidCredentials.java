package com.algnosis.auth_service.exceptionHandling;

import lombok.Data;

@Data
public class InvalidCredentials extends RuntimeException{
    private String message;

    public InvalidCredentials(String msg){
        this.setMessage(msg);
    }
}
