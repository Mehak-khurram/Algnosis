import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { name: 'Dashboard', to: '/patient/dashboard' },
    { name: 'Doctors', to: '/patient/doctors' },
    { name: 'Profile', to: '/patient/profile' },
    { name: 'Logout', to: '/logout' },
];

const PatientNavBar: React.FC = () => {
    return (
        <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 flex items-center h-14">
                <div className="flex-1 flex gap-2 sm:gap-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) =>
                                `px-3 py-2 rounded font-medium text-sm transition-colors duration-200 ${isActive
                                    ? 'bg-blue-900 text-white shadow'
                                    : 'text-blue-900 hover:bg-blue-50 hover:text-blue-900'
                                }`
                            }
                            end
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default PatientNavBar; 