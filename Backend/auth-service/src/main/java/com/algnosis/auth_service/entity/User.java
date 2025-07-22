package com.algnosis.auth_service.entity;


import lombok.Data;

@Data
public abstract class User {
    //Common inputs
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
}
