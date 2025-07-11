package com.algnosis.auth_service.exceptionHandling;

import lombok.Data;

@Data
public class EmailAlreadyRegistered extends RuntimeException{
    private String message;

    public EmailAlreadyRegistered(String msg){
        this.setMessage(msg);
    }
}
