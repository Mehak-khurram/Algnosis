package com.algnosis.auth_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "patient")
public class Patient extends User{
    @Id
    private String id;

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
