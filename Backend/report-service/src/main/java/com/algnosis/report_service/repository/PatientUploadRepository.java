package com.algnosis.report_service.repository;

import com.algnosis.report_service.entity.PatientUpload;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientUploadRepository extends MongoRepository<PatientUpload, String> {

    List<PatientUpload> findByEmail(String email);
}
