import React, { useState, useEffect } from 'react';
import { FaUserMd, FaBell, FaUserCircle, FaSignOutAlt } from 'react-icons/fa'; // Added FaSignOutAlt for logout icon
import { Link, useNavigate } from 'react-router-dom';

const doctorName = 'Smith'; // Replace with dynamic doctor name if available

interface Notification {
    message: string;
    timestamp: string;
    disease: string;
    reportID?: string; // Added reportID for navigation
    read?: string; // Added read attribute to Notification interface
    id: string; // Added id attribute to Notification interface
}

const DoctorNavBar: React.FC = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                // Only fetch notifications if a token exists
                if (!token) {
                    console.warn("No token found, skipping notification fetch.");
                    return;
                }

                const response = await fetch('http://localhost:8080/notif/doctor/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                const data = text ? JSON.parse(text) : [];
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
    }, []); // Add an empty dependency array to prevent infinite re-renders

    useEffect(() => {
        console.log('DoctorNavBar mounted on page:', window.location.pathname);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleLogout = () => {
        // Remove the authentication token from local storage
        localStorage.removeItem('token');
        // Redirect the user to the root page
        navigate('/');
    };

    const fetchReportDetails = async (reportID: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            console.log('Fetching report details for reportID:', reportID);
            const response = await fetch(`http://localhost:8020/reports/getreport?reportID=${reportID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch report details');
            }

            const report = await response.json();
            console.log('Fetched report details:', report);
            return report;
        } catch (error) {
            console.error('Error fetching report details:', error);
            alert('Failed to load report details.');
            return null;
        }
    };

    useEffect(() => {
        setNotifications((prevNotifications) =>
            [...prevNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
    }, []); // Add an empty dependency array to prevent infinite re-renders

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
                {/* Notification Bell */}
                <button
                    className="relative focus:outline-none"
                    onClick={toggleNotifications}
                    aria-label="View notifications"
                >
                    <FaBell className="text-2xl text-red-400 hover:text-red-600 transition" />
                    {notifications.filter(notif => notif.read === 'false').length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications.filter(notif => notif.read === 'false').length}
                        </span>
                    )}
                </button>
                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="absolute top-12 right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4 max-h-[300px] overflow-y-auto z-50">
                        {notifications.length > 0 ? (
                            notifications.map((notif, index) => (
                                <div
                                    key={index}
                                    className="p-2 border-b last:border-none cursor-pointer hover:bg-gray-100 transition relative"
                                    onClick={async () => {
                                        console.log('Notification clicked:', notif);
                                        try {
                                            const token = localStorage.getItem('token');
                                            if (!token) {
                                                throw new Error('No token found');
                                            }

                                            // Update notification status
                                            const updateResponse = await fetch(`http://localhost:8080/notif/doctor/update/${notif.id}`, {
                                                method: 'PUT',
                                                headers: {
                                                    Authorization: `Bearer ${token}`,
                                                },
                                            });

                                            if (!updateResponse.ok) {
                                                throw new Error('Failed to update notification status');
                                            }

                                            console.log('Notification status updated successfully');
                                        } catch (error) {
                                            console.error('Error updating notification status:', error);
                                        }

                                        const report = await fetchReportDetails(notif.reportID || '');
                                        if (report) {
                                            console.log('Navigating to:', `/doctor/notifications/${notif.reportID}`);
                                            console.log('Passing state:', { report });
                                            navigate(`/doctor/notifications/${notif.reportID}`, { state: { report } });
                                            window.location.reload();
                                        } else {
                                            console.warn('Report is null, navigation aborted.');
                                        }
                                    }}
                                >
                                    {notif.read === 'false' && (
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
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
                {/* User Profile Icon */}
                <button
                    className="focus:outline-none"
                    onClick={() => navigate('/doctor/profile')}
                    aria-label="View profile"
                >
                    <FaUserCircle className="text-2xl text-blue-500 hover:text-blue-700 transition" />
                </button>
                <span className="text-blue-900 font-semibold">Dr. {doctorName}</span>
                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 transition focus:outline-none ml-2"
                    aria-label="Logout"
                >
                    <FaSignOutAlt className="text-xl" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default DoctorNavBar;
