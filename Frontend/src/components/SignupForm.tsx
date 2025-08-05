import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


interface SignupFormProps {
    onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'patient',
        phone: '',
        // Patient-specific fields
        age: '',
        gender: '',
        allergies: '',
        medicalDevices: '',
        recentSurgery: '',
        dietaryRestrictions: '',
        currentMedications: '',
        emergencyContactPrimary: '',
        emergencyContactPrimaryPhone: '',
        emergencyContactSecondary: '',
        emergencyContactSecondaryPhone: '',
        // Doctor-specific fields
        specialisation: '',
        experience: '',
        qualifications: '',
        clinicName: '',
        licenseNumber: '',
        bio: '',
    });
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { userType, confirmPassword, password, ...restData } = formData;

            console.log(formData);

            // Prepare the correct API URL
            const apiUrl =
                userType === 'patient'
                    ? 'http://localhost:17000/auth/patient/register'
                    : 'http://localhost:17000/auth/doctor/register'; // change ports if needed

            // Prepare the data payload based on userType
            const payload = {
                ...restData,
                password,
            };

            console.log("calling api!");

            const response = await axios.post(apiUrl, payload);

            console.log(response)


            if (response.status === 200 || response.status === 201) {
                if (userType === 'patient') {
                    navigate('/patient/dashboard');
                } else {
                    navigate('/doctor/dashboard');
                }
            } else {
                alert("Signup failed.");
            }

            console.log('Signup attempt:', formData);

        } catch (error: any) {
            console.error("Signup error:", error);
            alert(error?.response?.data?.message || "Something went wrong.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Close signup form"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                        </label>
                        <select
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                            <option value="patient">Patient</option>
                            <option value="provider">Healthcare Provider</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="First name"
                            />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                placeholder="Last name"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Enter your phone number"
                        />
                    </div>

                    {/* Patient-specific fields */}
                    {formData.userType === 'patient' && (
                        <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                        Age
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Age"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    >
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Allergies"
                                    />
                                    <input
                                        type="text"
                                        name="medicalDevices"
                                        value={formData.medicalDevices}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Medical Devices/Implants"
                                    />
                                    <input
                                        type="text"
                                        name="recentSurgery"
                                        value={formData.recentSurgery}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Recent Surgery"
                                    />
                                    <input
                                        type="text"
                                        name="dietaryRestrictions"
                                        value={formData.dietaryRestrictions}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Dietary Restrictions"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Medications
                                </label>
                                <textarea
                                    id="currentMedications"
                                    name="currentMedications"
                                    value={formData.currentMedications}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="List current medications"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contacts</label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        name="emergencyContactPrimary"
                                        value={formData.emergencyContactPrimary}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Primary Contact Name"
                                    />
                                    <input
                                        type="tel"
                                        name="emergencyContactPrimaryPhone"
                                        value={formData.emergencyContactPrimaryPhone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Primary Contact Phone"
                                    />
                                    <input
                                        type="text"
                                        name="emergencyContactSecondary"
                                        value={formData.emergencyContactSecondary}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Secondary Contact Name"
                                    />
                                    <input
                                        type="tel"
                                        name="emergencyContactSecondaryPhone"
                                        value={formData.emergencyContactSecondaryPhone}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        placeholder="Secondary Contact Phone"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Doctor-specific fields */}
                    {formData.userType === 'provider' && (
                        <div className="space-y-4 border-t border-gray-200 pt-4 mt-4">
                            <div>
                                <label htmlFor="specialisation" className="block text-sm font-medium text-gray-700 mb-1">
                                    Specialisation
                                </label>
                                <select
                                    id="specialisation"
                                    name="specialisation"
                                    value={formData.specialisation}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                >
                                    <option value="">Select Specialisation</option>
                                    <option value="General Physician">General Physician</option>
                                    <option value="Pulmonology">Pulmonology</option>
                                    <option value="Neurology">Neurology</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                    Experience (years)
                                </label>
                                <input
                                    type="number"
                                    id="experience"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Years of experience"
                                />
                            </div>
                            <div>
                                <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-1">
                                    Qualifications
                                </label>
                                <input
                                    type="text"
                                    id="qualifications"
                                    name="qualifications"
                                    value={formData.qualifications}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="e.g. MBBS, MD, PhD"
                                />
                            </div>
                            <div>
                                <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">
                                    Clinic/Hospital Name
                                </label>
                                <input
                                    type="text"
                                    id="clinicName"
                                    name="clinicName"
                                    value={formData.clinicName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Clinic or Hospital Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    License Number
                                </label>
                                <input
                                    type="text"
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Medical License Number"
                                />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Tell us about yourself"
                                    rows={2}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Create a password"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button className="text-blue-600 hover:text-purple-600 font-medium">
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;