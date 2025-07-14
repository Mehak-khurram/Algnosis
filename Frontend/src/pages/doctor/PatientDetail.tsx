import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { FaUser, FaHistory, FaFileMedical, FaFileAlt } from 'react-icons/fa';

const placeholderPatient = {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    condition: 'Pneumonia (Recovered)',
    email: 'john.doe@example.com',
    phone: '+1 555-987-6543',
};

const patientHistory = [
    { date: '2024-04-01', event: 'Diagnosed with Pneumonia' },
    { date: '2024-04-10', event: 'Admitted to hospital' },
    { date: '2024-04-20', event: 'Discharged' },
    { date: '2024-05-01', event: 'Follow-up: Recovered' },
];

const recentReports = [
    { date: '2024-05-01', type: 'X-ray', summary: 'Clear lungs' },
    { date: '2024-04-15', type: 'Blood Test', summary: 'Normal' },
    { date: '2024-04-10', type: 'X-ray', summary: 'Infiltrates present' },
];

const recentReportSent = {
    date: '2024-05-01',
    type: 'X-ray',
    summary: 'Clear lungs',
    file: 'xray_may01.png',
};

const PatientDetail: React.FC = () => {
    const location = useLocation();
    const params = useParams();
    const patient = location.state?.patient || placeholderPatient;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
            <DoctorNavBar />
            <div className="max-w-6xl mx-auto mt-10 p-6">
                <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">Patient Details</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Patient Profile */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <FaUser className="text-2xl text-blue-500" />
                            <span className="font-semibold text-blue-900 text-lg">Profile</span>
                        </div>
                        <div><b>Name:</b> {patient.name}</div>
                        <div><b>Age:</b> {patient.age}</div>
                        <div><b>Gender:</b> {patient.gender}</div>
                        <div><b>Email:</b> {patient.email}</div>
                        <div><b>Phone:</b> {patient.phone}</div>
                        <div><b>Condition:</b> {patient.condition}</div>
                    </div>
                    {/* Patient History */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <FaHistory className="text-2xl text-blue-400" />
                            <span className="font-semibold text-blue-900 text-lg">History</span>
                        </div>
                        <ul className="list-disc ml-6">
                            {patientHistory.map((h, i) => (
                                <li key={i}><b>{h.date}:</b> {h.event}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Recent Reports */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <FaFileMedical className="text-2xl text-blue-400" />
                            <span className="font-semibold text-blue-900 text-lg">Recent Reports</span>
                        </div>
                        <ul className="list-disc ml-6">
                            {recentReports.map((r, i) => (
                                <li key={i}><b>{r.date}:</b> {r.type} - {r.summary}</li>
                            ))}
                        </ul>
                    </div>
                    {/* Most Recent Report Sent */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-3 mb-2">
                            <FaFileAlt className="text-2xl text-blue-400" />
                            <span className="font-semibold text-blue-900 text-lg">Most Recent Report Sent</span>
                        </div>
                        <div><b>Date:</b> {recentReportSent.date}</div>
                        <div><b>Type:</b> {recentReportSent.type}</div>
                        <div><b>Summary:</b> {recentReportSent.summary}</div>
                        <div><b>File:</b> {recentReportSent.file}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDetail; 