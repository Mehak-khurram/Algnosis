package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.PatientResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.dto.PatientSignUpResponseDTO;
import com.algnosis.auth_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDTO> getPatientData(){

        System.out.println("------------CONTROLLER WAS HIT----------");
        PatientResponseDTO patient = patientService.getLoggedInPatientDetails();
        return ResponseEntity.ok(patient);
    }

}
