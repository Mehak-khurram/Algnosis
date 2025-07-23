package com.algnosis.auth_service.mapper;

import com.algnosis.auth_service.dto.DoctorResponseDTO;
import com.algnosis.auth_service.dto.DoctorSignUpRequestDTO;
import com.algnosis.auth_service.entity.Doctor;

public class DoctorSignUpMapper{

    public static Doctor toEntity(DoctorSignUpRequestDTO dto) {
        Doctor doctor = new Doctor();

        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPassword(dto.getPassword());
        doctor.setPhoneNumber(dto.getPhoneNumber());

        doctor.setQualifications(dto.getQualifications());
        doctor.setHospitalName(dto.getHospitalName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setShortBio(dto.getShortBio());
        doctor.setMedicalLicenseNumber(dto.getMedicalLicenseNumber());
        doctor.setYearsOfExperience(dto.getYearsOfExperience());

        //doctor.setRole("DOCTOR");

        return doctor;
    }

    public static DoctorSignUpRequestDTO toDTO(Doctor entity) {

        DoctorSignUpRequestDTO doctorDTO = new DoctorSignUpRequestDTO();

        doctorDTO.setFirstName(entity.getFirstName());
        doctorDTO.setLastName(entity.getLastName());
        doctorDTO.setEmail(entity.getEmail());
        doctorDTO.setPassword(entity.getPassword());
        doctorDTO.setPhoneNumber(entity.getPhoneNumber());

        doctorDTO.setQualifications(entity.getQualifications());
        doctorDTO.setHospitalName(entity.getHospitalName());
        doctorDTO.setSpecialization(entity.getSpecialization());
        doctorDTO.setShortBio(entity.getShortBio());
        doctorDTO.setMedicalLicenseNumber(entity.getMedicalLicenseNumber());
        doctorDTO.setYearsOfExperience(entity.getYearsOfExperience());

        //doctorDTO.setRole("DOCTOR");

        return doctorDTO;
    }

    public static DoctorResponseDTO toDoctorResponseDTO(Doctor entity) {

        DoctorResponseDTO doctorDTO = new DoctorResponseDTO();

        doctorDTO.setFirstName(entity.getFirstName());
        doctorDTO.setLastName(entity.getLastName());
        doctorDTO.setEmail(entity.getEmail());
        doctorDTO.setPassword(entity.getPassword());
        doctorDTO.setPhoneNumber(entity.getPhoneNumber());

        doctorDTO.setQualifications(entity.getQualifications());
        doctorDTO.setHospitalName(entity.getHospitalName());
        doctorDTO.setSpecialization(entity.getSpecialization());
        doctorDTO.setShortBio(entity.getShortBio());
        doctorDTO.setMedicalLicenseNumber(entity.getMedicalLicenseNumber());
        doctorDTO.setYearsOfExperience(entity.getYearsOfExperience());
        doctorDTO.setAssignedReports(entity.getAssignedReports());

        //doctorDTO.setRole("DOCTOR");

        return doctorDTO;
    }
}
