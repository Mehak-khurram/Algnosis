import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.tsx';
import PatientDashboard from './pages/patient/Dashboard.tsx';
import UploadReport from './pages/patient/UploadReport.tsx';
import DoctorsList from './pages/patient/DoctorsList.tsx';
import DiagnosisResult from './pages/patient/DiagnosisResult.tsx';
import DoctorDashboard from './pages/doctor/Dashboard.tsx';
import MyPatients from './pages/doctor/MyPatients.tsx';
import Notifications from './pages/doctor/Notifications.tsx';
import NotificationDetail from './pages/doctor/NotificationDetail.tsx';
import DoctorDiagnosisResult from './pages/doctor/DoctorDiagnosisResult.tsx';
import Profile from './pages/doctor/Profile.tsx';
import PatientDetail from './pages/doctor/PatientDetail.tsx';
import BrainTumorResult from './pages/doctor/BrainTumorResult.tsx';
import Reports from './pages/patient/Reports.tsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/patient/dashboard" element={<PatientDashboard />} />
                <Route path="/patient/upload-report" element={<UploadReport />} />
                <Route path="/patient/doctors" element={<DoctorsList />} />
                <Route path="/patient/diagnosis-result" element={<DiagnosisResult />} />
                <Route path="/patient/reports" element={<Reports />} />
                <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
                <Route path="/doctor/my-patients" element={<MyPatients />} />
                <Route path="/doctor/notifications" element={<Notifications />} />
                <Route path="/doctor/notifications/:id" element={<NotificationDetail />} />
                <Route path="/doctor/diagnosis-result" element={<DoctorDiagnosisResult />} />
                <Route path="/doctor/profile" element={<Profile />} />
                <Route path="/doctor/patient/:id" element={<PatientDetail />} />
                <Route path="/doctor/brain-tumor-result" element={<BrainTumorResult />} />
                {/* Add more routes here as needed */}
            </Routes>
        </Router>
    );
}

export default App;
