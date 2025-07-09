package com.algnosis.auth_service.service;


import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.mapper.PatientSignUpRequestDTOToPatientMapper;
import com.algnosis.auth_service.mapper.PatientToPatientSignUpRequestDTOMapper;
import com.algnosis.auth_service.entity.Patient;
import com.algnosis.auth_service.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private final PatientRepository patientRepo;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    //CONSTRUCTOR
    public PatientService(PatientRepository patientRepo, BCryptPasswordEncoder passwordEncoder) {
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
    }

    //HANDLING PATIENT REGISTRATION
    public PatientSignUpRequestDTO registerPatient(PatientSignUpRequestDTO request){

        Patient patient = PatientSignUpRequestDTOToPatientMapper.toPatient(request);

        if(!emailAlreadyExists(request.getEmail())){
            //throw custom exception: Email already exists! Please login instead.
        }

        //hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        patient.setPassword(hashedPassword);

        PatientSignUpRequestDTO patientSignUpRequestDTO = PatientToPatientSignUpRequestDTOMapper.toDTO(
                patientRepo.save(patient)
        );

        return patientSignUpRequestDTO;
    }

    //CHECKING IF EMAIL IS ALREADY SIGNED UP/ ACCOUNT ALREADY EXISTS
    public boolean emailAlreadyExists(String email){
        return patientRepo.findByEmail(email).isPresent();
    }
}
