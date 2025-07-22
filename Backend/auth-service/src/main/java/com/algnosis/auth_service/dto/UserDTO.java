package com.algnosis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public abstract class UserDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
}
