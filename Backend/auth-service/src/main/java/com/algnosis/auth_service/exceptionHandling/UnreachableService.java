package com.algnosis.auth_service.exceptionHandling;

import lombok.Data;

@Data
public class UnreachableService extends RuntimeException{
    private String message;
    public UnreachableService(String msg){
        super(msg);
        this.message=msg;
    }
}
