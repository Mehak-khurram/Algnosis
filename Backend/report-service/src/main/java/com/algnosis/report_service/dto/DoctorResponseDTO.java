package com.algnosis.report_service.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

//THIS IS A DTO USED TO GET DOCTORS FROM AUTH-SERVICE
//BASED ON THEIR SPECIALIZATIONS SO I CAN ASSIGN
//A DOCTOR TO A PATIENT
@Data
@RequiredArgsConstructor
public class DoctorResponseDTO {

    private String id;

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
