package com.algnosis.auth_service.controller;


import com.algnosis.auth_service.dto.LogInRequestDTO;
import com.algnosis.auth_service.dto.LogInResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.dto.PatientSignUpResponseDTO;
import com.algnosis.auth_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class PatientController {
    private PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @PostMapping("/patient/register")
    public ResponseEntity<PatientSignUpResponseDTO> registerPatient(@RequestBody PatientSignUpRequestDTO patient){

            System.out.println("------------CONTROLLER WAS HIT----------");
            PatientSignUpResponseDTO registeredPatient = patientService.registerPatient(patient);
            return ResponseEntity.ok(registeredPatient);
    }

    @PostMapping("/patient/login")
    public ResponseEntity<LogInResponseDTO> loginDoctor(@RequestBody LogInRequestDTO logInRequestDTO){
        LogInResponseDTO logInResponseDTO = patientService.loginPatient(logInRequestDTO);
        return ResponseEntity.ok(logInResponseDTO);
    }
}
