package com.algnosis.auth_service.feignClient;

import com.algnosis.auth_service.exceptionHandling.UnreachableService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class ReportServiceClientFallback implements ReportServiceClient{
    @Override
    public Set<String> getEmailsOfPatientsAssignedToDoctor(String doctorId) {
        throw new UnreachableService("Report-service not reachable. This error is thrown by " +
                "GetEmailsOfPatientsAssignedToDoctor in ReportServiceClientFallback.");
    }

}
