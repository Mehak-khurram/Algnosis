package com.algnosis.auth_service.mapper;

import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.entity.Patient;

public class PatientSignUpMapper {

    public static Patient toEntity(PatientSignUpRequestDTO patientDTO) {
        Patient patient = new Patient();

        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setAge(patientDTO.getAge());
        patient.setEmail(patientDTO.getEmail());
        patient.setAllergies(patientDTO.getAllergies());
        patient.setGender(patientDTO.getGender());
        patient.setPassword(patientDTO.getPassword());
        patient.setCurrentMedications(patientDTO.getCurrentMedications());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        patient.setMedicalDevices(patientDTO.getMedicalDevices());
        patient.setRestrictions(patientDTO.getRestrictions());
        patient.setRecentSurgery(patientDTO.getRecentSurgery());
        patient.setPrimaryContactName(patientDTO.getPrimaryContactName());
        patient.setPrimaryContactPhone(patientDTO.getPrimaryContactPhone());
        patient.setSecondaryContactName(patientDTO.getSecondaryContactName());
        patient.setSecondaryContactPhone(patientDTO.getSecondaryContactPhone());

        //patient.setRole("PATIENT");

        return patient;
    }

    public static PatientSignUpRequestDTO toDTO(Patient patient) {
        PatientSignUpRequestDTO patientDTO = new PatientSignUpRequestDTO();

        patientDTO.setFirstName(patient.getFirstName());
        patientDTO.setLastName(patient.getLastName());
        patientDTO.setAge(patient.getAge());
        patientDTO.setEmail(patient.getEmail());
        patientDTO.setAllergies(patient.getAllergies());
        patientDTO.setGender(patient.getGender());
        patientDTO.setPassword(patient.getPassword());
        patientDTO.setCurrentMedications(patient.getCurrentMedications());
        patientDTO.setPhoneNumber(patient.getPhoneNumber());
        patientDTO.setMedicalDevices(patient.getMedicalDevices());
        patientDTO.setRestrictions(patient.getRestrictions());
        patientDTO.setRecentSurgery(patient.getRecentSurgery());
        patientDTO.setPrimaryContactName(patient.getPrimaryContactName());
        patientDTO.setPrimaryContactPhone(patient.getPrimaryContactPhone());
        patientDTO.setSecondaryContactName(patient.getSecondaryContactName());
        patientDTO.setSecondaryContactPhone(patient.getSecondaryContactPhone());

        //patientDTO.setRole("PATIENT");

        return patientDTO;
    }
}
