package com.algnosis.auth_service.service;


import com.algnosis.auth_service.dto.*;
import com.algnosis.auth_service.entity.Doctor;
import com.algnosis.auth_service.entity.Patient;
import com.algnosis.auth_service.exceptionHandling.DoctorNotFound;
import com.algnosis.auth_service.exceptionHandling.EmailAlreadyRegistered;
import com.algnosis.auth_service.exceptionHandling.InvalidCredentials;
import com.algnosis.auth_service.exceptionHandling.PatientNotFound;
import com.algnosis.auth_service.feignClient.ReportServiceClient;
import com.algnosis.auth_service.mapper.PatientSignUpMapper;
import com.algnosis.auth_service.repository.PatientRepository;
import com.algnosis.auth_service.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private final PatientRepository patientRepo;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private final JWTService jwtService;

    @Autowired
    private final ReportServiceClient reportServiceClient;

    @Autowired
    private final DoctorService doctorService;

    //CONSTRUCTOR
    public PatientService(
            PatientRepository patientRepo,
            BCryptPasswordEncoder passwordEncoder,
            JWTService jwtService,
            ReportServiceClient reportServiceClient,
            DoctorService doctorService
    ) {
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.reportServiceClient = reportServiceClient;
        this.doctorService = doctorService;
    }

    //HANDLING PATIENT REGISTRATION
    public PatientSignUpResponseDTO registerPatient(PatientSignUpRequestDTO request) {

        request.setActive(true);

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

    public PatientResponseDTO getPatientDetailsByEmail(String email) {

        Patient patient = (Patient) patientRepo.findByEmail(email)
                .orElseThrow(() -> new PatientNotFound("No patient found. This" +
                        "error is thrown by getPatientDetailsByEmail function " +
                        "in PatientService class by Auth-service."));

        return PatientSignUpMapper.toPatientResponseDTO(patient);
    }

    public PatientResponseDTO updatePatientProfile(PatientResponseDTO updatedData) {
        // 1. Get logged-in user's email from token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // 2. Fetch patient by email
        Patient existing = (Patient) patientRepo.findByEmail(email)
                .orElseThrow(() -> new PatientNotFound("No patient found with email: " + email
                + ". This error is thrown by updatePatientProfile function in PatientService class of auth-service."));

        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setPhoneNumber(updatedData.getPhoneNumber());

        existing.setAge(updatedData.getAge());
        existing.setGender(updatedData.getGender());

        existing.setAllergies(updatedData.getAllergies());
        existing.setRestrictions(updatedData.getRestrictions());
        existing.setCurrentMedications(updatedData.getCurrentMedications());
        existing.setMedicalDevices(updatedData.getMedicalDevices());
        existing.setRecentSurgery(updatedData.getRecentSurgery());

        existing.setPrimaryContactName(updatedData.getPrimaryContactName());
        existing.setPrimaryContactPhone(updatedData.getPrimaryContactPhone());
        existing.setSecondaryContactName(updatedData.getSecondaryContactName());
        existing.setPrimaryContactPhone(updatedData.getSecondaryContactPhone());


        // 4. Save updated patient
        Patient saved = patientRepo.save(existing);

        // 5. Return DTO
        return PatientSignUpMapper.toPatientResponseDTO(saved);
    }

    public PatientResponseDTO getPatientDetailsByID(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // This gives the subject of JWT (usually email)

        // Fetch doctor by email
        Patient patient = patientRepo.findById(id)
                .orElseThrow(() -> new PatientNotFound("No doctor found with email: " + email+
                        ". This error is thrown by function getDoctorData in DoctorService by Auth-service."));

        PatientResponseDTO patientResponseDTO = PatientSignUpMapper.toPatientResponseDTO(patient);

        return  patientResponseDTO;
    }

    /**
     * Get all doctors assigned to the currently logged-in patient
     * @return List of DoctorResponseDTO representing assigned doctors
     */
    public List<DoctorResponseDTO> getAssignedDoctors() {
        // 1. Get current patient's email from JWT token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String patientEmail = authentication.getName();

        System.out.println("Fetching assigned doctors for patient: " + patientEmail);

        try {
            // 2. Get all reports for this patient from report-service
            List<PatientUploadDTO> patientReports = reportServiceClient.getReportsByPatientEmail(patientEmail);
            
            System.out.println("Found " + patientReports.size() + " reports for patient");

            // 3. Extract unique doctor IDs from reports
            Set<String> doctorIds = patientReports.stream()
                    .map(PatientUploadDTO::getDoctorID)
                    .filter(doctorId -> doctorId != null && !doctorId.isEmpty())
                    .collect(Collectors.toSet());

            System.out.println("Found " + doctorIds.size() + " unique doctor IDs: " + doctorIds);

            // 4. Fetch doctor details for each doctor ID
            List<DoctorResponseDTO> assignedDoctors = new ArrayList<>();
            for (String doctorId : doctorIds) {
                try {
                    DoctorResponseDTO doctor = doctorService.getDoctorByID(doctorId);
                    assignedDoctors.add(doctor);
                    System.out.println("Added doctor: " + doctor.getFirstName() + " " + doctor.getLastName());
                } catch (DoctorNotFound e) {
                    System.err.println("Doctor not found for ID: " + doctorId + ". Skipping...");
                    // Continue with other doctors even if one is not found
                }
            }

            System.out.println("Returning " + assignedDoctors.size() + " assigned doctors");
            return assignedDoctors;

        } catch (Exception e) {
            System.err.println("Error fetching assigned doctors for patient " + patientEmail + ": " + e.getMessage());
            e.printStackTrace();
            // Return empty list instead of throwing exception to prevent breaking the API
            return new ArrayList<>();
        }
    }
}
