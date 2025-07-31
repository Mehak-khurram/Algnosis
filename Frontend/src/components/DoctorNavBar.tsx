import React, { useState, useEffect } from 'react';
import { FaUserMd, FaFileMedical, FaChartBar, FaUserCircle, FaBell } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const doctorName = 'Smith'; // Replace with dynamic doctor name if available

interface Notification {
    message: string;
    timestamp: string;
    disease: string;
}

const DoctorNavBar: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/notif/doctor/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                const data: Notification[] = text ? JSON.parse(text) : [];
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

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
                <Link to="/doctor/notifications" className="text-blue-800 font-semibold hover:text-blue-600 transition">Reports</Link>
            </div>
            <div className="flex items-center gap-4 relative">
                <button
                    className="relative focus:outline-none"
                    onClick={toggleNotifications}
                    aria-label="View notifications"
                >
                    <FaBell className="text-2xl text-red-400 hover:text-red-600 transition" />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 max-h-[300px] overflow-y-auto z-10">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div key={index} className="p-2 border-b last:border-none">
                                    <p className="text-sm font-semibold text-blue-800">{notif.message}</p>
                                    <p className="text-xs text-gray-600">Disease: {notif.disease}</p>
                                    <p className="text-xs text-gray-500">{new Date(notif.timestamp).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No notifications available.</p>
                        )}
                    </div>
                )}
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