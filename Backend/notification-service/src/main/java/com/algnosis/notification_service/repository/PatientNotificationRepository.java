package com.algnosis.notification_service.repository;

import com.algnosis.notification_service.entity.PatientNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientNotificationRepository extends MongoRepository<PatientNotification, String> {

    List<PatientNotification> findByPatientID(String patientID);
}