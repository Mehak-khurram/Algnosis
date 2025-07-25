package com.algnosis.auth_service.mapper;

import com.algnosis.auth_service.dto.PatientResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.dto.PatientSignUpResponseDTO;
import com.algnosis.auth_service.entity.Patient;

import java.util.Arrays;
import java.util.List;

public class PatientSignUpMapper {

    public static Patient toEntity(PatientSignUpRequestDTO patientDTO) {
        Patient patient = new Patient();

        patient.setFirstName(patientDTO.getFirstName());
        patient.setLastName(patientDTO.getLastName());
        patient.setAge(patientDTO.getAge());
        patient.setEmail(patientDTO.getEmail());
        //first split the allergies by comma
        patient.setAllergies(patientDTO.getAllergies());
        patient.setGender(patientDTO.getGender());
        patient.setPassword(patientDTO.getPassword());
        //splitting current medications by comma
        patient.setCurrentMedications(patientDTO.getCurrentMedications());
        patient.setPhoneNumber(patientDTO.getPhoneNumber());
        //splitting medical devices by comma
        patient.setMedicalDevices(patientDTO.getMedicalDevices());
        //splitting restrictions by comma
        patient.setRestrictions(patientDTO.getRestrictions());
        patient.setRecentSurgery(patientDTO.getRecentSurgery());
        patient.setPrimaryContactName(patientDTO.getPrimaryContactName());
        patient.setPrimaryContactPhone(patientDTO.getPrimaryContactPhone());
        patient.setSecondaryContactName(patientDTO.getSecondaryContactName());
        patient.setSecondaryContactPhone(patientDTO.getSecondaryContactPhone());

        //patient.setRole("PATIENT");

        return patient;
    }

    public static PatientSignUpResponseDTO toDTO(Patient patient) {
        PatientSignUpResponseDTO patientDTO = new PatientSignUpResponseDTO();

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

    public static PatientResponseDTO toPatientResponseDTO(Patient patient) {
        PatientResponseDTO patientDTO = new PatientResponseDTO();

        patientDTO.setId(patient.getId());
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
