package com.algnosis.auth_service.controller;


import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @PostMapping("/register")
    public ResponseEntity<PatientSignUpRequestDTO> registerPatient(@RequestBody PatientSignUpRequestDTO patient){
            PatientSignUpRequestDTO registeredPatient = patientService.registerPatient(patient);
            return ResponseEntity.ok(registeredPatient);
    }
}
