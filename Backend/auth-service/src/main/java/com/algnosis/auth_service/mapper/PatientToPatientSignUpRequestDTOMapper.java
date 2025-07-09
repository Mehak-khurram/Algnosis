package com.algnosis.auth_service.mapper;

import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.entity.Patient;

public class PatientToPatientSignUpRequestDTOMapper {
    public static PatientSignUpRequestDTO toDTO(Patient patient){

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

        return patientDTO;
    }
}
