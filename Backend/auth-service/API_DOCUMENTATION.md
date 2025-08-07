# Patient Assigned Doctors API

## New Endpoint: Get Assigned Doctors for Patient

### **GET** `/patient/assigned-doctors`

**Description**: Fetches all doctors assigned to the currently logged-in patient based on their medical reports.

**Authentication**: Requires `PATIENT` role (JWT token)

**Headers**:
```
Authorization: Bearer <patient_jwt_token>
Content-Type: application/json
```

**Request**: No request body required

**Response**:
```json
[
  {
    "id": "67891011121314151617181920",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@hospital.com",
    "phoneNumber": "+1-555-123-4567",
    "specialization": "Pulmonology",
    "yearsOfExperience": 10,
    "qualifications": "MBBS, MD",
    "hospitalName": "City General Hospital",
    "medicalLicenseNumber": "ML12345",
    "shortBio": "Experienced pulmonologist specializing in respiratory diseases",
    "assignedReports": ["report1", "report2"],
    "role": "DOCTOR"
  },
  {
    "id": "67891011121314151617181921",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@hospital.com",
    "phoneNumber": "+1-555-987-6543",
    "specialization": "Neurology",
    "yearsOfExperience": 8,
    "qualifications": "MBBS, DM",
    "hospitalName": "City General Hospital",
    "medicalLicenseNumber": "ML67890",
    "shortBio": "Neurologist with expertise in brain tumor diagnosis",
    "assignedReports": ["report3"],
    "role": "DOCTOR"
  }
]
```

**Status Codes**:
- `200 OK`: Successfully retrieved assigned doctors
- `401 Unauthorized`: Invalid or missing JWT token
- `403 Forbidden`: User does not have PATIENT role
- `500 Internal Server Error`: Service error

**Example cURL Request**:
```bash
curl -X GET http://localhost:17000/patient/assigned-doctors \
  -H "Authorization: Bearer <patient_jwt_token>" \
  -H "Content-Type: application/json"
```

## How it Works

1. **Authentication**: The endpoint extracts the patient's email from the JWT token
2. **Fetch Reports**: Calls the report-service to get all reports for the patient
3. **Extract Doctor IDs**: Collects unique doctor IDs from the reports
4. **Fetch Doctor Details**: Retrieves full doctor information for each ID
5. **Return Results**: Returns the list of assigned doctors

## Error Handling

- If the report-service is unavailable, the fallback mechanism throws an `UnreachableService` exception
- If a doctor ID is not found, that doctor is skipped (logged) but the API continues
- If no reports exist for the patient, an empty array is returned
- Service errors are logged but don't break the API (returns empty array)

## Integration Points

- **Report Service**: `GET /reports/get/email?email={patientEmail}`
- **Auth Service**: `DoctorService.getDoctorByID(doctorId)`

## Frontend Integration

You can use this API in your React frontend like this:

```javascript
const fetchAssignedDoctors = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:17000/patient/assigned-doctors', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch assigned doctors');
    }
    
    const doctors = await response.json();
    console.log('Assigned doctors:', doctors);
    return doctors;
  } catch (error) {
    console.error('Error fetching assigned doctors:', error);
    return [];
  }
};
```

## Testing

To test this API:

1. **Start Services**:
   - Auth Service: `http://localhost:17000`
   - Report Service: `http://localhost:8020`

2. **Get Patient Token**: Login as a patient to get JWT token

3. **Make Request**: Use the token to call the endpoint

4. **Verify Response**: Check that doctors from patient's reports are returned

## Database Dependencies

- **Auth Service MongoDB**: Patient and Doctor collections
- **Report Service MongoDB**: PatientReport collection with `doctorID` field

The API creates a bridge between the auth-service (user data) and report-service (medical reports) to provide a comprehensive view of patient-doctor relationships.