import React from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';

const notifications = [
    { id: 1, patient: 'John Doe', message: 'Uploaded a new X-ray report.' },
    { id: 2, patient: 'Jane Smith', message: 'Sent a follow-up question.' },
    { id: 3, patient: 'Ali Khan', message: 'Requested appointment reschedule.' },
    { id: 4, patient: 'Maria Garcia', message: 'Uploaded lab results.' },
];

const Notifications: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full max-w-7xl px-8 pt-8 pb-2">
                    <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left">
                        Notifications
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl p-8">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className="bg-white rounded-2xl shadow-xl p-6 border-l-8 border-red-400 hover:scale-105 hover:shadow-2xl transition-transform duration-300 animate-fadein cursor-pointer"
                            onClick={() => navigate(`/doctor/notifications/${notif.id}`)}
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/doctor/notifications/${notif.id}`); }}
                        >
                            <div className="text-lg font-bold text-blue-900 mb-1">{notif.patient}</div>
                            <div className="text-gray-700">{notif.message}</div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadein-left {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadein-left {
          animation: fadein-left 1s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </div>
    );
};

export default Notifications; 