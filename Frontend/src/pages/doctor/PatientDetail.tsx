import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { 
    FaUser, 
    FaEnvelope, 
    FaPhone, 
    FaBirthdayCake, 
    FaVenusMars, 
    FaAllergies, 
    FaPills, 
    FaHeartbeat, 
    FaUserMd, 
    FaHistory, 
    FaFileMedical, 
    FaArrowLeft,
    FaExclamationTriangle,
    FaStethoscope,
    FaIdCard,
    FaCalendarAlt
} from 'react-icons/fa';

// Toast component for notifications
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in-up ${
        type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
    }`}>
        <div className="flex items-center justify-between">
            <span>{message}</span>
            <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
        </div>
    </div>
);

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    age: number;
    gender: string;
    allergies?: string;
    restrictions?: string;
    currentMedications?: string;
    medicalDevices?: string;
    recentSurgery?: string;
    primaryContactName?: string;
    primaryContactPhone?: string;
    secondaryContactName?: string;
    secondaryContactPhone?: string;
    role?: string;
}

interface Report {
    id: string;
    email: string;
    createdAt: string;
    status: string;
    disease: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    doctorID: string;
    diagnosis: string;
    diagnosisSummary: string;
    diagnosisUrl: string;
}

const PatientDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const patient = location.state?.patient;
    
    const [patientReports, setPatientReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fetch patient reports
    useEffect(() => {
        if (patient?.email) {
            fetchPatientReports();
        }
    }, [patient?.email]);

    const fetchPatientReports = async () => {
        if (!patient?.email) return;
        
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8020/reports/get/email?email=${patient.email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch patient reports');
            }
            
            const data = await response.json();
            setPatientReports(data);
        } catch (err) {
            console.error('Error fetching patient reports:', err);
            setError('Could not load patient reports.');
            setToast({ message: 'Failed to load patient reports.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (report: Report) => {
        navigate(`/doctor/notifications/${report.id}`, { state: { report } });
    };

    if (!patient) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-red-700 mb-4">Patient not found</div>
                        <button 
                            onClick={() => navigate(-1)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tileClasses = "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400 transition-all duration-300 hover:shadow-lg";
    const headerClasses = "text-xl font-semibold text-blue-800 mb-4 border-b pb-2 border-blue-200";
    const labelClasses = "text-sm font-medium text-gray-700 mb-1";
    const valueClasses = "text-gray-800";

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <DoctorNavBar />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="flex-1 w-full max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                        
                            <h1 className="text-3xl font-bold text-blue-900">Patient Details</h1>
                        </div>
                        <p className="text-gray-600">Comprehensive patient information and medical history</p>
                    </div>
                   
                </div>

                {/* Patient Summary Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                <FaUser className="text-2xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h2>
                                <p className="text-blue-100">{patient.email}</p>
                                <p className="text-blue-200 text-sm">{patient.phoneNumber}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{patient.age}</div>
                            <div className="text-blue-200 text-sm">Years Old</div>
                            <div className="text-blue-100 text-sm mt-1">{patient.gender}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Personal Information</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className={labelClasses}>
                                        <FaUser className="inline mr-2 text-blue-600" />
                                        Full Name
                                    </div>
                                    <div className={valueClasses}>{patient.firstName} {patient.lastName}</div>
                                </div>
                                <div>
                                    <div className={labelClasses}>
                                        <FaIdCard className="inline mr-2 text-blue-600" />
                                        Patient ID
                                    </div>
                                    <div className={valueClasses}>{patient.id}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className={labelClasses}>
                                        <FaEnvelope className="inline mr-2 text-blue-600" />
                                        Email Address
                                    </div>
                                    <div className={valueClasses}>{patient.email}</div>
                                </div>
                                <div>
                                    <div className={labelClasses}>
                                        <FaPhone className="inline mr-2 text-blue-600" />
                                        Phone Number
                                    </div>
                                    <div className={valueClasses}>{patient.phoneNumber}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className={labelClasses}>
                                        <FaBirthdayCake className="inline mr-2 text-blue-600" />
                                        Age
                                    </div>
                                    <div className={valueClasses}>{patient.age} years old</div>
                                </div>
                                <div>
                                    <div className={labelClasses}>
                                        <FaVenusMars className="inline mr-2 text-blue-600" />
                                        Gender
                                    </div>
                                    <div className={valueClasses}>{patient.gender}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Medical Information</h2>
                        <div className="space-y-4">
                            {patient.allergies && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaAllergies className="inline mr-2 text-red-600" />
                                        Allergies
                                    </div>
                                    <div className={`${valueClasses} text-red-700 font-medium`}>{patient.allergies}</div>
                                </div>
                            )}
                            
                            {patient.currentMedications && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaPills className="inline mr-2 text-green-600" />
                                        Current Medications
                                    </div>
                                    <div className={valueClasses}>{patient.currentMedications}</div>
                                </div>
                            )}
                            
                            {patient.medicalDevices && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaHeartbeat className="inline mr-2 text-purple-600" />
                                        Medical Devices
                                    </div>
                                    <div className={valueClasses}>{patient.medicalDevices}</div>
                                </div>
                            )}
                            
                            {patient.restrictions && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaExclamationTriangle className="inline mr-2 text-orange-600" />
                                        Restrictions
                                    </div>
                                    <div className={`${valueClasses} text-orange-700 font-medium`}>{patient.restrictions}</div>
                                </div>
                            )}
                            
                            {patient.recentSurgery && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaStethoscope className="inline mr-2 text-blue-600" />
                                        Recent Surgery
                                    </div>
                                    <div className={valueClasses}>{patient.recentSurgery}</div>
                                </div>
                            )}

                            {!patient.allergies && !patient.currentMedications && !patient.medicalDevices && !patient.restrictions && !patient.recentSurgery && (
                                <div className="text-gray-500 text-center py-4">
                                    No medical information available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Emergency Contacts</h2>
                        <div className="space-y-4">
                            {patient.primaryContactName && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaUserMd className="inline mr-2 text-blue-600" />
                                        Primary Contact
                                    </div>
                                    <div className={valueClasses}>
                                        {patient.primaryContactName}
                                        {patient.primaryContactPhone && (
                                            <span className="text-gray-600 ml-2">({patient.primaryContactPhone})</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {patient.secondaryContactName && (
                                <div>
                                    <div className={labelClasses}>
                                        <FaUser className="inline mr-2 text-blue-600" />
                                        Secondary Contact
                                    </div>
                                    <div className={valueClasses}>
                                        {patient.secondaryContactName}
                                        {patient.secondaryContactPhone && (
                                            <span className="text-gray-600 ml-2">({patient.secondaryContactPhone})</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!patient.primaryContactName && !patient.secondaryContactName && (
                                <div className="text-gray-500 text-center py-4">
                                    No emergency contacts available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Patient Reports */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Medical Reports</h2>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="text-gray-600">Loading reports...</div>
                            </div>
                        ) : patientReports.length > 0 ? (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {patientReports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => handleReportClick(report)}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <FaFileMedical className="text-blue-600" />
                                                <span className="font-medium text-gray-800">{report.disease}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                report.status === 'completed' 
                                                    ? 'bg-green-100 text-green-700' 
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <FaCalendarAlt className="text-gray-400" />
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </div>
                                            {report.diagnosis && (
                                                <div className="mt-1 font-medium text-gray-700">
                                                    Diagnosis: {report.diagnosis}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-center py-4">
                                No medical reports available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default PatientDetail;