package com.algnosis.auth_service.mapper;

import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.entity.Patient;

public class PatientSignUpRequestDTOToPatientMapper {
    public static Patient toPatient(PatientSignUpRequestDTO patientDTO){
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

        return patient;
    }
}
