package com.algnosis.auth_service.service;


import com.algnosis.auth_service.dto.*;
import com.algnosis.auth_service.entity.Patient;
import com.algnosis.auth_service.exceptionHandling.EmailAlreadyRegistered;
import com.algnosis.auth_service.exceptionHandling.InvalidCredentials;
import com.algnosis.auth_service.exceptionHandling.PatientNotFound;
import com.algnosis.auth_service.mapper.PatientSignUpMapper;
import com.algnosis.auth_service.repository.PatientRepository;
import com.algnosis.auth_service.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private final PatientRepository patientRepo;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private final JWTService jwtService;

    //CONSTRUCTOR
    public PatientService(
            PatientRepository patientRepo,
            BCryptPasswordEncoder passwordEncoder,
            JWTService jwtService
    ) {
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    //HANDLING PATIENT REGISTRATION
    public PatientSignUpResponseDTO registerPatient(PatientSignUpRequestDTO request) {

        Patient patient = PatientSignUpMapper.toEntity(request);

        if(emailAlreadyExists(request.getEmail())){
            //throw custom exception: Email already exists! Please login instead.
            throw new EmailAlreadyRegistered("Email " + request.getEmail() + " is already registered.");
        }

        //hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        patient.setPassword(hashedPassword);

        PatientSignUpResponseDTO patientSignUpResponseDTO = PatientSignUpMapper.toDTO(
                patientRepo.save(patient)
        );

        return patientSignUpResponseDTO;
    }

    //CHECKING IF EMAIL IS ALREADY SIGNED UP/ ACCOUNT ALREADY EXISTS
    public boolean emailAlreadyExists(String email){
        return patientRepo.findByEmail(email).isPresent();
    }

    public LogInResponseDTO loginPatient(LogInRequestDTO loginRequestDTO){
        //FIRST FIND THE PATIENT BY EMAIL
        Patient patient = (Patient) patientRepo.findByEmail(loginRequestDTO.getEmail()).orElseThrow(
                () -> new InvalidCredentials("Email address or password incorrect.")
        );

        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), patient.getPassword())){
            throw new InvalidCredentials("Email address or password incorrect.");
        }

        String token = jwtService.generateToken(patient.getEmail(), patient.getRole());
        return new LogInResponseDTO(token, patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getRole());
    }


    public PatientResponseDTO getLoggedInPatientDetails() {
        // 1. Get email from authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // JWT subject

        // 2. Fetch patient from DB
        Patient patient = (Patient) patientRepo.findByEmail(email)
                .orElseThrow(() -> new PatientNotFound("No patient found. This" +
                        "error is thrown by getLoggedInPatientDetails function " +
                        "in PatientService class by Auth-service."));

        // 3. Map to DTO
        return PatientSignUpMapper.toPatientResponseDTO(patient);
    }
}
