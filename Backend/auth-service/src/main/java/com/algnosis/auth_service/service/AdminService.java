package com.algnosis.auth_service.service;

import com.algnosis.auth_service.repository.DoctorRepository;
import com.algnosis.auth_service.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class AdminService {
    @Autowired
    private DoctorRepository doctorRepo;
    @Autowired
    private PatientRepository patientRepo;

    public AdminService(DoctorRepository doctorRepo, PatientRepository patientRepo) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
    }
}
