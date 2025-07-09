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
public class Patient {
    @Id
    private String id;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String phoneNumber;
    private int age;
    private String gender;

    private List<String> allergies;
    private List<String> restrictions;
    private List<String> medicalDevices;
    private String recentSurgery;
    private List<String> currentMedications;

    //EMERGENCY CONTACTS(PRIMARY + SECONDARY)
    private String primaryContactName;
    private String primaryContactPhone;
    private String secondaryContactName;
    private String secondaryContactPhone;

}
