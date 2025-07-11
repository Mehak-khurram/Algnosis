package com.algnosis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LogInResponseDTO {
    private String token;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}
