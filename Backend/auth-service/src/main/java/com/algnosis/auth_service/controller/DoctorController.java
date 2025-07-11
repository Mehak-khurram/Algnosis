package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.DoctorSignUpRequestDTO;
import com.algnosis.auth_service.dto.LogInRequestDTO;
import com.algnosis.auth_service.dto.LogInResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.service.DoctorService;
import com.algnosis.auth_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class DoctorController {
    private DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    @PostMapping("/doctor/register")
    public ResponseEntity<DoctorSignUpRequestDTO> registerDoctor(@RequestBody DoctorSignUpRequestDTO doctor){
        DoctorSignUpRequestDTO registeredDoctor = doctorService.registerDoctor(doctor);
        return ResponseEntity.ok(registeredDoctor);
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<LogInResponseDTO> loginDoctor(@RequestBody LogInRequestDTO logInRequestDTO){
        LogInResponseDTO logInResponseDTO = doctorService.loginDoctor(logInRequestDTO);
        return ResponseEntity.ok(logInResponseDTO);
    }
}
