package com.algnosis.report_service.exceptionHandling;

public class NoDoctorAvailable extends RuntimeException{
    private String msg;

    public NoDoctorAvailable(String msg){
        super(msg);
        this.msg = msg;
    }
}
