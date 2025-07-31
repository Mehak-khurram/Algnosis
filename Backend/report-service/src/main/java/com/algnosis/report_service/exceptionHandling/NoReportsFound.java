package com.algnosis.report_service.exceptionHandling;

public class NoReportsFound extends RuntimeException{
    private String msg;

    public NoReportsFound(String msg){
        super(msg);
        this.msg = msg;
    }
}
