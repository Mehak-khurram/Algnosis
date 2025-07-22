package com.algnosis.auth_service.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "doctor")
public class Doctor extends User{

    @Id
    private String id;

    private String specialization;
    private int yearsOfExperience;
    private String qualifications;
    private String hospitalName;
    private String medicalLicenseNumber;
    private String shortBio;
    private final String role = "DOCTOR";
}
