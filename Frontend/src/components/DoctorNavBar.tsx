import React from 'react';
import { FaUserMd, FaFileMedical, FaChartBar, FaUserCircle, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const doctorName = 'Smith'; // Replace with dynamic doctor name if available

const DoctorNavBar: React.FC = () => {
    const navigate = useNavigate();
    return (
        <nav className="w-full bg-white/90 shadow flex items-center justify-between px-8 py-4 border-b border-blue-100">
            <div className="flex items-center gap-4">
                <FaUserMd className="text-2xl text-blue-600" />
                <span className="text-xl font-bold text-blue-900">Doctor Portal</span>
            </div>
            <div className="flex gap-8 items-center">
                <Link to="/doctor/dashboard" className="text-blue-800 font-semibold hover:text-blue-600 transition">Dashboard</Link>
                <Link to="/doctor/my-patients" className="text-blue-800 font-semibold hover:text-blue-600 transition">Patients</Link>
                <Link to="/doctor/profile" className="text-blue-800 font-semibold hover:text-blue-600 transition">Profile</Link>
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="relative focus:outline-none"
                    onClick={() => navigate('/doctor/notifications')}
                    aria-label="View notifications"
                >
                    <FaBell className="text-2xl text-red-400 hover:text-red-600 transition" />
                </button>
                <button
                    className="focus:outline-none"
                    onClick={() => navigate('/doctor/profile')}
                    aria-label="View profile"
                >
                    <FaUserCircle className="text-2xl text-blue-500 hover:text-blue-700 transition" />
                </button>
                <span className="text-blue-900 font-semibold">Dr. {doctorName}</span>
            </div>
        </nav>
    );
};

export default DoctorNavBar; 