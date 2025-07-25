package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.*;
import com.algnosis.auth_service.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class DoctorAuthController {
    private DoctorService doctorService;

    public DoctorAuthController(DoctorService doctorService){
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
