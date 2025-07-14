import React, { useState } from 'react';
import { FaUserEdit, FaEnvelope, FaUserMd, FaPhone, FaHospital, FaSave } from 'react-icons/fa';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

// Placeholder doctor data (replace with real API call later)
const initialDoctor = {
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    specialty: 'Pulmonology',
    phone: '+1 555-123-4567',
    hospital: 'City General Hospital',
    license: 'MD123456',
};

const Profile: React.FC = () => {
    const [doctor, setDoctor] = useState(initialDoctor);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(initialDoctor);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setDoctor(form);
        setEditMode(false);
        // TODO: Save to backend
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <DoctorNavBar />
            <div className="max-w-4xl mx-auto mt-10 p-6">
                <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">My Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaUserMd className="text-3xl text-blue-500" />
                        <div>
                            <div className="text-gray-500 text-sm">Name</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.name}</div>
                            )}
                        </div>
                    </div>
                    {/* Email */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaEnvelope className="text-3xl text-blue-400" />
                        <div>
                            <div className="text-gray-500 text-sm">Email</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.email}</div>
                            )}
                        </div>
                    </div>
                    {/* Specialty */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaUserMd className="text-3xl text-blue-400" />
                        <div>
                            <div className="text-gray-500 text-sm">Specialty</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="specialty"
                                    value={form.specialty}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.specialty}</div>
                            )}
                        </div>
                    </div>
                    {/* Phone */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaPhone className="text-3xl text-blue-400" />
                        <div>
                            <div className="text-gray-500 text-sm">Phone</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.phone}</div>
                            )}
                        </div>
                    </div>
                    {/* Hospital */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaHospital className="text-3xl text-blue-400" />
                        <div>
                            <div className="text-gray-500 text-sm">Hospital</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="hospital"
                                    value={form.hospital}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.hospital}</div>
                            )}
                        </div>
                    </div>
                    {/* License */}
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
                        <FaUserMd className="text-3xl text-blue-400" />
                        <div>
                            <div className="text-gray-500 text-sm">License</div>
                            {editMode ? (
                                <input
                                    className="border rounded px-2 py-1 w-full mt-1"
                                    name="license"
                                    value={form.license}
                                    onChange={handleChange}
                                />
                            ) : (
                                <div className="font-semibold text-blue-900 text-lg">{doctor.license}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    {editMode ? (
                        <button
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
                            onClick={handleSave}
                        >
                            <FaSave /> Save
                        </button>
                    ) : (
                        <button
                            className="bg-blue-100 text-blue-900 px-6 py-2 rounded-lg shadow hover:bg-blue-200 flex items-center gap-2"
                            onClick={() => setEditMode(true)}
                        >
                            <FaUserEdit /> Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 