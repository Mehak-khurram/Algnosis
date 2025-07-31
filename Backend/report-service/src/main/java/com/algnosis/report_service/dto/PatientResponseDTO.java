package com.algnosis.report_service.dto;

import lombok.Data;

@Data
public class PatientResponseDTO {

    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;

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

    private String role = "PATIENT";
}
