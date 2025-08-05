package com.algnosis.auth_service.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@Document(collection = "admin")
public class Admin {
    private final String email = "admin@algnosis.com";
    private final String password = "admin@123";
}
