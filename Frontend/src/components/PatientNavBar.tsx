import React, { useState } from 'react';
import { Menu, X, Stethoscope } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', to: '/patient/dashboard' },
    { name: 'Doctors', to: '/patient/doctors' },
    { name: 'Reports', to: '/patient/reports' },
    { name: 'Logout', to: '/logout', isLogout: true },
];

const PatientNavBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // Logout handler
    const handleLogout = (e?: React.MouseEvent) => {
        e?.preventDefault();
        localStorage.removeItem('token');
        navigate('/');
    };

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