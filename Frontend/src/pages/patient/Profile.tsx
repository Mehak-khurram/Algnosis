import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaEnvelope, FaUser, FaPhone, FaSave, FaTimes, FaCheck, FaAllergies, FaPills, FaHeartbeat, FaCut, FaUtensils, FaCalendarAlt } from 'react-icons/fa';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import { useNavigate } from 'react-router-dom';

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

interface PatientProfile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    age: number;
    gender: string;
    allergies: string;
    restrictions: string;
    medicalDevices: string;
    recentSurgery: string;
    currentMedications: string;
    primaryContactName: string;
    primaryContactPhone: string;
    secondaryContactName: string;
    secondaryContactPhone: string;
    role?: string;
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<PatientProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: 0,
        gender: '',
        allergies: '',
        restrictions: '',
        medicalDevices: '',
        recentSurgery: '',
        currentMedications: '',
        primaryContactName: '',
        primaryContactPhone: '',
        secondaryContactName: '',
        secondaryContactPhone: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fetch patient profile on component mount
    useEffect(() => {
        fetchPatientProfile();
    }, []);

    const fetchPatientProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log('Token for profile fetch:', token ? 'Token exists' : 'No token found');
            
            const response = await fetch('http://localhost:17000/patient/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log('Profile fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch patient profile');
            }
            const data = await response.json();
            console.log('Profile data received:', data);
            
                         // Transform the data to match our interface
             const patientData: PatientProfile = {
                 id: data.id,
                 firstName: data.firstName || '',
                 lastName: data.lastName || '',
                 email: data.email || '',
                 phoneNumber: data.phoneNumber || '',
                 age: data.age || 0,
                 gender: data.gender || '',
                 allergies: data.allergies || '',
                 restrictions: data.restrictions || '',
                 medicalDevices: data.medicalDevices || '',
                 recentSurgery: data.recentSurgery || '',
                 currentMedications: data.currentMedications || '',
                 primaryContactName: data.primaryContactName || '',
                 primaryContactPhone: data.primaryContactPhone || '',
                 secondaryContactName: data.secondaryContactName || '',
                 secondaryContactPhone: data.secondaryContactPhone || '',
                 role: data.role
             };
            
            setPatient(patientData);
            setForm(patientData);
        } catch (err) {
            setError('Could not load profile data.');
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: name === 'age' ? parseInt(value) || 0 : value 
        }));
    };



    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            
                         // Create the update payload with all required fields
             const updatePayload = {
                 ...patient, // Include all original fields (id, password, role, etc.)
                 ...form,   // Override with form changes
                 role: 'PATIENT' // Ensure role is set
             };

            console.log('Update payload:', updatePayload); // Debug log

            const response = await fetch('http://localhost:17000/patient/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatePayload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update failed:', response.status, errorText);
                throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
            }

            const updatedData = await response.json();
            setPatient(updatedData);
            setEditMode(false);
            setToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            console.error('Error updating profile:', err);
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm(patient || {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            age: 0,
            gender: '',
            allergies: '',
            restrictions: '',
            medicalDevices: '',
            recentSurgery: '',
            currentMedications: '',
            primaryContactName: '',
            primaryContactPhone: '',
            secondaryContactName: '',
            secondaryContactPhone: ''
        });
        setEditMode(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <PatientNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-700">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (error || !patient) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <PatientNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-700 mb-4">{error || 'Profile not found.'}</div>
                        <button 
                            onClick={fetchPatientProfile}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tileClasses = "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400 transition-all duration-300 hover:shadow-lg";
    const headerClasses = "text-xl font-semibold text-blue-800 mb-4 border-b pb-2 border-blue-200";
    const labelClasses = "text-sm font-medium text-gray-700 mb-2 block";
    const inputClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";
    const valueClasses = "text-gray-800 font-medium";

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <PatientNavBar />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
                         <div className="flex-1 w-full max-w-7xl mx-auto p-8 pt-24">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your personal information and medical details</p>
                    </div>
                    <div className="flex gap-4">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    disabled={saving}
                                >
                                    <FaTimes /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <FaCheck /> {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </>
                        ) : (
                                                         <button
                                 onClick={() => setEditMode(true)}
                                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                             >
                                 <FaUserEdit /> Edit Profile
                             </button>
                        )}
                    </div>
                </div>

                {!editMode && (
                    <div className="mt-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h3>
                                    <p className="text-blue-100 text-lg">{patient.age} years old • {patient.gender}</p>
                                    <p className="text-blue-200 text-sm mt-1">{patient.email}</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <br></br>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Personal Information</h2>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>
                                        <FaUser className="inline mr-2 text-blue-600" />
                                        First Name
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="Enter first name"
                                        />
                                    ) : (
                                        <div className={valueClasses}>{patient.firstName}</div>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClasses}>
                                        <FaUser className="inline mr-2 text-blue-600" />
                                        Last Name
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="Enter last name"
                                        />
                                    ) : (
                                        <div className={valueClasses}>{patient.lastName}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaEnvelope className="inline mr-2 text-blue-600" />
                                    Email Address
                                </label>
                                {editMode ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter email address"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.email}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaPhone className="inline mr-2 text-blue-600" />
                                    Phone Number
                                </label>
                                {editMode ? (
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={form.phoneNumber}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter phone number"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.phoneNumber}</div>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClasses}>
                                        <FaCalendarAlt className="inline mr-2 text-blue-600" />
                                        Age
                                    </label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={form.age}
                                            onChange={handleChange}
                                            className={inputClasses}
                                            placeholder="Enter age"
                                            min="0"
                                            max="150"
                                        />
                                    ) : (
                                        <div className={valueClasses}>{patient.age} years</div>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClasses}>
                                        <FaUser className="inline mr-2 text-blue-600" />
                                        Gender
                                    </label>
                                    {editMode ? (
                                        <select
                                            name="gender"
                                            value={form.gender}
                                            onChange={handleChange}
                                            className={inputClasses}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <div className={valueClasses}>{patient.gender}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Medical Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>
                                    <FaAllergies className="inline mr-2 text-blue-600" />
                                    Allergies (comma-separated)
                                </label>
                                                                 {editMode ? (
                                     <input
                                         type="text"
                                         name="allergies"
                                         value={form.allergies}
                                         onChange={handleChange}
                                         className={inputClasses}
                                         placeholder="e.g., Peanuts, Penicillin, Latex"
                                     />
                                 ) : (
                                     <div className={valueClasses}>
                                         {patient.allergies || 'None'}
                                     </div>
                                 )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaUtensils className="inline mr-2 text-blue-600" />
                                    Dietary Restrictions (comma-separated)
                                </label>
                                                                 {editMode ? (
                                     <input
                                         type="text"
                                         name="restrictions"
                                         value={form.restrictions}
                                         onChange={handleChange}
                                         className={inputClasses}
                                         placeholder="e.g., Gluten-free, Dairy-free"
                                     />
                                 ) : (
                                     <div className={valueClasses}>
                                         {patient.restrictions || 'None'}
                                     </div>
                                 )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaHeartbeat className="inline mr-2 text-blue-600" />
                                    Medical Devices (comma-separated)
                                </label>
                                                                 {editMode ? (
                                     <input
                                         type="text"
                                         name="medicalDevices"
                                         value={form.medicalDevices}
                                         onChange={handleChange}
                                         className={inputClasses}
                                         placeholder="e.g., Pacemaker, Insulin pump"
                                     />
                                 ) : (
                                     <div className={valueClasses}>
                                         {patient.medicalDevices || 'None'}
                                     </div>
                                 )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaCut className="inline mr-2 text-blue-600" />
                                    Recent Surgery
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="recentSurgery"
                                        value={form.recentSurgery}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter recent surgery details"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.recentSurgery || 'None'}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaPills className="inline mr-2 text-blue-600" />
                                    Current Medications (comma-separated)
                                </label>
                                                                 {editMode ? (
                                     <input
                                         type="text"
                                         name="currentMedications"
                                         value={form.currentMedications}
                                         onChange={handleChange}
                                         className={inputClasses}
                                         placeholder="e.g., Aspirin, Metformin"
                                     />
                                 ) : (
                                     <div className={valueClasses}>
                                         {patient.currentMedications || 'None'}
                                     </div>
                                 )}
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contacts */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Emergency Contacts</h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>
                                    <FaUser className="inline mr-2 text-blue-600" />
                                    Primary Contact Name
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="primaryContactName"
                                        value={form.primaryContactName}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter primary contact name"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.primaryContactName || 'Not specified'}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaPhone className="inline mr-2 text-blue-600" />
                                    Primary Contact Phone
                                </label>
                                {editMode ? (
                                    <input
                                        type="tel"
                                        name="primaryContactPhone"
                                        value={form.primaryContactPhone}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter primary contact phone"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.primaryContactPhone || 'Not specified'}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaUser className="inline mr-2 text-blue-600" />
                                    Secondary Contact Name
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="secondaryContactName"
                                        value={form.secondaryContactName}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter secondary contact name"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.secondaryContactName || 'Not specified'}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaPhone className="inline mr-2 text-blue-600" />
                                    Secondary Contact Phone
                                </label>
                                {editMode ? (
                                    <input
                                        type="tel"
                                        name="secondaryContactPhone"
                                        value={form.secondaryContactPhone}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter secondary contact phone"
                                    />
                                ) : (
                                    <div className={valueClasses}>{patient.secondaryContactPhone || 'Not specified'}</div>
                                )}
                            </div>
                        </div>
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

export default Profile; 