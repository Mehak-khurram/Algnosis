package com.algnosis.auth_service.repository;

import com.algnosis.auth_service.entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Object> findByEmail(String email);
}
