package com.algnosis.auth_service.dto;

import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Data
@RequiredArgsConstructor
public class DoctorResponseDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;

    private List<String> assignedReports;

    private String specialization;
    private int yearsOfExperience;
    private String qualifications;
    private String hospitalName;
    private String medicalLicenseNumber;
    private String shortBio;
    private final String role = "DOCTOR";
}
