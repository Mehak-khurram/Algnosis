package com.algnosis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientSignUpRequestDTO extends UserDTO{

    private int age;
    private String gender;

    private String allergies;
    private String restrictions;
    private String medicalDevices;
    private String recentSurgery;
    private String currentMedications;

    //EMERGENCY CONTACTS(PRIMARY + SECONDARY)
    private String primaryContactName;
    private String primaryContactPhone;
    private String secondaryContactName;
    private String secondaryContactPhone;

    private final String role = "PATIENT";
}
