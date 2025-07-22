package com.algnosis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorSignUpRequestDTO extends UserDTO{

    private String specialization;
    private int yearsOfExperience;
    private String qualifications;
    private String hospitalName;
    private String medicalLicenseNumber;
    private String shortBio;

    private final String role = "DOCTOR";
}
