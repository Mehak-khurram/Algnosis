import React, { useState, useEffect } from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaBirthdayCake, FaVenusMars, FaStethoscope, FaExclamationTriangle, FaUserFriends, FaSearch, FaSpinner } from 'react-icons/fa';

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

const MyPatients: React.FC = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fetch patients assigned to the logged-in doctor
    useEffect(() => {
        fetchPatients();
    }, []);

    // Filter patients based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const filtered = patients.filter(patient =>
                `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phoneNumber.includes(searchTerm)
            );
            setFilteredPatients(filtered);
        }
    }, [searchTerm, patients]);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching patients for doctor...');
            
            const response = await fetch('http://localhost:17000/doctor/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log('Patients fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            
            const data = await response.json();
            console.log('Patients data received:', data);
            setPatients(data);
            setFilteredPatients(data);
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError('Could not load patients data.');
            setToast({ message: 'Failed to load patients. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePatientClick = (patient: Patient) => {
        navigate(`/doctor/patient/${patient.id}`, { state: { patient } });
    };

    const handleRetry = () => {
        fetchPatients();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-blue-700">Loading patients...</div>
                        <p className="text-gray-600 mt-2">Fetching your assigned patients</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && patients.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
                        <div className="text-2xl font-bold text-red-700 mb-4">{error}</div>
                        <button 
                            onClick={handleRetry}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tileClasses = "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer";
    const headerClasses = "text-xl font-semibold text-blue-800 mb-4 border-b pb-2 border-blue-200";

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
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900 flex items-center gap-3">
                                <FaUserFriends className="text-blue-600" />
                                My Patients
                            </h1>
                            <p className="text-gray-600 mt-1">Manage and view your assigned patients</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search patients by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Patients Grid */}
                {filteredPatients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className={tileClasses}
                                onClick={() => handlePatientClick(patient)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <FaUser className="text-blue-600 text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {patient.firstName} {patient.lastName}
                                            </h3>
                                            <p className="text-gray-600 text-sm">Patient ID: {patient.id.substring(0, 8)}...</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaEnvelope className="text-blue-500 text-sm" />
                                        <span className="text-sm truncate">{patient.email}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaPhone className="text-blue-500 text-sm" />
                                        <span className="text-sm">{patient.phoneNumber}</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaBirthdayCake className="text-blue-500 text-sm" />
                                            <span className="text-sm">{patient.age} years</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <FaVenusMars className="text-blue-500 text-sm" />
                                            <span className="text-sm">{patient.gender}</span>
                                        </div>
                                    </div>

                                    {/* Additional Info */}
                                    {(patient.allergies || patient.currentMedications || patient.recentSurgery) && (
                                        <div className="pt-3 border-t border-gray-200">
                                            <div className="flex items-center gap-2 text-orange-600 text-sm">
                                                <FaStethoscope className="text-orange-500" />
                                                <span className="font-medium">Medical Notes</span>
                                            </div>
                                            {patient.allergies && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Allergies:</strong> {patient.allergies}
                                                </p>
                                            )}
                                            {patient.currentMedications && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Medications:</strong> {patient.currentMedications}
                                                </p>
                                            )}
                                            {patient.recentSurgery && (
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Recent Surgery:</strong> {patient.recentSurgery}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-blue-600 text-sm font-medium">View Details</span>
                                    <div className="text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <FaUserFriends className="text-6xl text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                            {searchTerm ? 'No patients found' : 'No patients assigned'}
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm 
                                ? `No patients match "${searchTerm}". Try a different search term.`
                                : 'You currently have no patients assigned to you.'
                            }
                        </p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                )}


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

export default MyPatients;