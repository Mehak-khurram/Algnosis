import React, { useState, useEffect } from 'react';
import { Menu, X, Stethoscope, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', to: '/patient/dashboard' },
    { name: 'Doctors', to: '/patient/doctors' },
    { name: 'Upload', to: '/patient/reports' },
    { name: 'Report', to: '/patient/submitted-reports' },
    { name: 'Logout', to: '/logout', isLogout: true },
];

const PatientNavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [reports, setReports] = useState<any[]>([]);
    const navigate = useNavigate();

    // Logout handler
    const handleLogout = (e?: React.MouseEvent) => {
        e?.preventDefault();
        localStorage.removeItem('token');
        navigate('/');
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8080/notif/patient/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch notifications');
                const data = await response.json();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        const fetchReports = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8020/reports/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch reports');
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchNotifications();
        fetchReports();
    }, []); // Add an empty dependency array to prevent infinite re-renders

    // Sort notifications by date in descending order
    useEffect(() => {
        setNotifications((prevNotifications) =>
            [...prevNotifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        );
    }, []); // Add an empty dependency array to prevent infinite re-renders

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Algnosis</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            item.isLogout ? (
                                <a
                                    key={item.name}
                                    href="#"
                                    className="text-gray-500 hover:text-blue-600 transition font-medium"
                                    onClick={handleLogout}
                                >
                                    {item.name}
                                </a>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.to}
                                    className="text-gray-500 hover:text-blue-600 transition font-medium"
                                >
                                    {item.name}
                                </Link>
                            )
                        ))}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative text-gray-500 hover:text-blue-600 transition font-medium"
                            >
                                <Bell className="w-6 h-6" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                                    <div className="p-4 border-b border-gray-100">
                                        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                                    </div>
                                    {notifications.length > 0 ? (
                                        <ul className="divide-y divide-gray-100">
                                            {notifications.map((notif) => {
                                                const report = reports.find((r) => r.id === notif.reportID);
                                                return (
                                                    <li
                                                        key={notif.id}
                                                        className="p-4 hover:bg-gray-50 transition-colors duration-200 ease-in-out cursor-pointer flex items-start space-x-3"
                                                        onClick={async () => {
                                                            try {
                                                                // Existing POST request
                                                                await fetch(`http://localhost:8080/notif/patient/${notif.id}`, {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                                                    },
                                                                });

                                                                // New PUT request to update the notification
                                                                await fetch(`http://localhost:8080/notif/patient/update/${notif.id}`, {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                                                    },
                                                                });
                                                            } catch (error) {
                                                                console.error('Error updating notification:', error);
                                                            }
                                                            navigate(`/patient/report-uploaded/${notif.reportID}`, { state: { notif, report } });
                                                            window.location.reload();
                                                        }}
                                                    >
                                                        <div className="flex-shrink-0">
                                                            {notif.read === 'false' && (
                                                                <span className="w-3 h-3 bg-red-500 rounded-full block"></span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-800">{notif.message}</p>
                                                            <p className="text-sm text-gray-600">Disease: {notif.disease}</p>
                                                            <p className="text-xs text-gray-500 mt-1">{new Date(notif.timestamp).toLocaleString()}</p>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500">
                                            No notifications available.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="bg-transparent text-gray-900 p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            {navItems.map((item) => (
                                item.isLogout ? (
                                    <a
                                        key={item.name}
                                        href="#"
                                        className="block px-3 py-2 text-gray-500 hover:text-blue-600 font-medium"
                                        onClick={(e) => { setIsOpen(false); handleLogout(e); }}
                                    >
                                        {item.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={item.name}
                                        to={item.to}
                                        className="block px-3 py-2 text-gray-500 hover:text-blue-600 font-medium"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default PatientNavBar;