package com.algnosis.report_service.exceptionHandling;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
public class UnreachableService extends RuntimeException{
    private String message;
    public UnreachableService(String msg){
        super(msg);
        this.message=msg;
    }
}
