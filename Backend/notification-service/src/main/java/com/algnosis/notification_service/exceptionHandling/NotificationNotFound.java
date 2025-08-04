package com.algnosis.notification_service.exceptionHandling;

public class NotificationNotFound extends RuntimeException{
    private String message;
    public NotificationNotFound(String msg){
        super(msg);
        this.message = msg;
    }
}
