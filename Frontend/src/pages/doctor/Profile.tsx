import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaEnvelope, FaUserMd, FaPhone, FaHospital, FaSave, FaIdCard, FaGraduationCap, FaCalendarAlt, FaStethoscope, FaTimes, FaCheck } from 'react-icons/fa';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

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

interface DoctorProfile {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    assignedReports?: string[];
    specialization: string;
    yearsOfExperience: number;
    qualifications: string;
    hospitalName: string;
    medicalLicenseNumber: string;
    shortBio: string;
    role?: string;
}

const Profile: React.FC = () => {
    const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<DoctorProfile>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        specialization: '',
        yearsOfExperience: 0,
        qualifications: '',
        hospitalName: '',
        medicalLicenseNumber: '',
        shortBio: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Fetch doctor profile on component mount
    useEffect(() => {
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            console.log('Token for profile fetch:', token ? 'Token exists' : 'No token found');
            
            const response = await fetch('http://localhost:17000/doctor/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log('Profile fetch response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Failed to fetch doctor profile');
            }
            const data = await response.json();
            console.log('Profile data received:', data);
            setDoctor(data);
            setForm(data);
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
            [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            
            // Create the update payload with all required fields from the original doctor data
            const updatePayload = {
                ...doctor, // Include all original fields (id, password, assignedReports, role, etc.)
                ...form,   // Override with form changes
                role: 'DOCTOR' // Ensure role is set
            };

            console.log('Update payload:', updatePayload); // Debug log

            const response = await fetch('http://localhost:17000/doctor/update', {
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
            setDoctor(updatedData);
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
        setForm(doctor || {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            specialization: '',
            yearsOfExperience: 0,
            qualifications: '',
            hospitalName: '',
            medicalLicenseNumber: '',
            shortBio: ''
        });
        setEditMode(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-2xl font-bold text-blue-700">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-700 mb-4">{error || 'Profile not found.'}</div>
                        <button 
                            onClick={fetchDoctorProfile}
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
            <DoctorNavBar />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
            <div className="flex-1 w-full max-w-7xl mx-auto p-8">
                
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
                        <p className="text-gray-600 mt-1">Manage your professional information and settings</p>
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
                                    <h3 className="text-2xl font-bold">Dr. {doctor.firstName} {doctor.lastName}</h3>
                                    <p className="text-blue-100 text-lg">{doctor.specialization}</p>
                                    <p className="text-blue-200 text-sm mt-1">{doctor.hospitalName}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">{doctor.yearsOfExperience}</div>
                                    <div className="text-blue-200 text-sm">Years Experience</div>
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
                                        <FaUserMd className="inline mr-2 text-blue-600" />
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
                                        <div className={valueClasses}>{doctor.firstName}</div>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClasses}>
                                        <FaUserMd className="inline mr-2 text-blue-600" />
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
                                        <div className={valueClasses}>{doctor.lastName}</div>
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
                                    <div className={valueClasses}>{doctor.email}</div>
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
                                    <div className={valueClasses}>{doctor.phoneNumber}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Professional Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>
                                    <FaStethoscope className="inline mr-2 text-blue-600" />
                                    Specialization
                                </label>
                                {editMode ? (
                                    <select
                                        name="specialization"
                                        value={form.specialization}
                                        onChange={handleChange}
                                        className={inputClasses}
                                    >
                                        <option value="">Select Specialization</option>
                                        <option value="General Physician">General Physician</option>
                                        <option value="Pulmonology">Pulmonology</option>
                                        <option value="Neurology">Neurology</option>
                                    
                                    </select>
                                ) : (
                                    <div className={valueClasses}>{doctor.specialization}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaCalendarAlt className="inline mr-2 text-blue-600" />
                                    Years of Experience
                                </label>
                                {editMode ? (
                                    <input
                                        type="number"
                                        name="yearsOfExperience"
                                        value={form.yearsOfExperience}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter years of experience"
                                        min="0"
                                        max="50"
                                    />
                                ) : (
                                    <div className={valueClasses}>{doctor.yearsOfExperience} years</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaGraduationCap className="inline mr-2 text-blue-600" />
                                    Qualifications
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="qualifications"
                                        value={form.qualifications}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="e.g., MBBS, MD, FCPS"
                                    />
                                ) : (
                                    <div className={valueClasses}>{doctor.qualifications}</div>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>
                                    <FaIdCard className="inline mr-2 text-blue-600" />
                                    Medical License Number
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="medicalLicenseNumber"
                                        value={form.medicalLicenseNumber}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter license number"
                                    />
                                ) : (
                                    <div className={valueClasses}>{doctor.medicalLicenseNumber}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hospital Information */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Hospital Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className={labelClasses}>
                                    <FaHospital className="inline mr-2 text-blue-600" />
                                    Hospital Name
                                </label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="hospitalName"
                                        value={form.hospitalName}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="Enter hospital name"
                                    />
                                ) : (
                                    <div className={valueClasses}>{doctor.hospitalName}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Professional Bio</h2>
                        <div>
                            <label className={labelClasses}>
                                Short Bio
                            </label>
                            {editMode ? (
                                <textarea
                                    name="shortBio"
                                    value={form.shortBio}
                                    onChange={handleChange}
                                    className={`${inputClasses} h-32 resize-none`}
                                    placeholder="Write a brief professional bio..."
                                />
                            ) : (
                                <div className={`${valueClasses} text-gray-700 leading-relaxed`}>
                                    {doctor.shortBio || 'No bio provided.'}
                                </div>
                            )}
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