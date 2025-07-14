import React, { useState } from 'react';
import { FaUserMd, FaFileMedical, FaEdit, FaLightbulb, FaBell, FaUserCircle } from 'react-icons/fa';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';

const doctorName = 'Smith'; // Replace with dynamic doctor name if available

const wellBeingTips = [
    'Encourage patients to stay hydrated and rest.',
    'Remind patients to follow up on their medications.',
    'Promote regular physical activity and healthy eating.',
    'Advise patients to get regular checkups.',
    'Share mental health resources and support.',
];

const DoctorDashboard: React.FC = () => {
    const [tipIndex, setTipIndex] = useState(0);
    const nextTip = () => setTipIndex((tipIndex + 1) % wellBeingTips.length);
    const prevTip = () => setTipIndex((tipIndex - 1 + wellBeingTips.length) % wellBeingTips.length);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col relative overflow-hidden">
            <DoctorNavBar />
            {/* Animated background SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.12 }} aria-hidden="true">
                <circle cx="12%" cy="20%" r="80" fill="#60a5fa">
                    <animate attributeName="cy" values="20%;30%;20%" dur="8s" repeatCount="indefinite" />
                </circle>
                <circle cx="80%" cy="70%" r="100" fill="#f472b6">
                    <animate attributeName="cy" values="70%;60%;70%" dur="10s" repeatCount="indefinite" />
                </circle>
                <rect x="60%" y="10%" width="60" height="60" rx="20" fill="#fbbf24">
                    <animate attributeName="y" values="10%;20%;10%" dur="12s" repeatCount="indefinite" />
                </rect>
                <circle cx="50%" cy="90%" r="40" fill="#34d399">
                    <animate attributeName="cy" values="90%;80%;90%" dur="9s" repeatCount="indefinite" />
                </circle>
            </svg>
            {/* Main content (z-10) */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                {/* Personalisation message above tiles */}
                <div className="w-full max-w-7xl px-8 pt-8 pb-2">
                    <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left">
                        Hello Dr, {doctorName}
                    </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-6 gap-6 w-full h-full max-w-7xl p-8 min-h-[80vh]">
                    {/* Recent Reports - Large, left (col 1-4, row 1-3) */}
                    <div className="col-span-4 row-span-3 bg-white rounded-2xl shadow-xl flex flex-col p-8 border-l-8 border-pink-400 hover:scale-105 transition-transform duration-300 animate-fadein delay-100">
                        <div className="flex items-center gap-4">
                            <FaFileMedical className="text-4xl text-pink-500" />
                            <h2 className="text-2xl font-bold text-pink-900">Recent Reports</h2>
                        </div>
                        <ul className="mt-6 space-y-2">
                            <li className="text-gray-700">John Doe - X-ray <span className="text-xs text-gray-400">(2h ago)</span></li>
                            <li className="text-gray-700">Jane Smith - CT Scan <span className="text-xs text-gray-400">(5h ago)</span></li>
                            <li className="text-gray-700">Ali Khan - MRI <span className="text-xs text-gray-400">(1d ago)</span></li>
                        </ul>
                    </div>
                    {/* Patients Overview - Small, top right (col 5-6, row 1) */}
                    <div
                        className="col-span-2 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col justify-between p-8 border-l-8 border-blue-400 transition-transform duration-300 animate-fadein delay-150 col-start-5 row-start-1 hover:scale-110 hover:shadow-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
                        tabIndex={0}
                        onClick={() => navigate('/doctor/my-patients')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/my-patients'); }}
                    >
                        <div className="flex items-center gap-4">
                            <FaUserMd className="text-2xl text-blue-500" />
                            <h2 className="text-xl font-bold text-blue-900">Patients</h2>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-700 mt-4 mb-1">42</div>
                        <div className="text-gray-500">Active patients</div>
                    </div>
                    {/* Notifications - Top right, below Patients (col 5-6, row 2) */}
                    <div
                        className="col-span-2 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 border-l-8 border-red-400 hover:scale-110 hover:shadow-2xl transition-transform duration-300 animate-fadein delay-200 col-start-5 row-start-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400"
                        tabIndex={0}
                        onClick={() => navigate('/doctor/notifications')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/notifications'); }}
                    >
                        <FaBell className="text-2xl text-red-400 mb-2" />
                        <div className="text-red-700 font-semibold">No new notifications</div>
                    </div>
                    {/* Update Profile - Medium, right (col 5-6, row 3) */}
                    <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 border-l-8 border-indigo-400 hover:scale-105 transition-transform duration-300 animate-fadein delay-250 col-start-5 row-start-3">
                        <FaEdit className="text-2xl text-indigo-500 mb-2" />
                        <button className="text-indigo-700 font-semibold" onClick={() => navigate('/doctor/profile')}>Update Profile</button>
                    </div>
                    {/* Well-being Tips for Patients - large, bottom left (col 1-4, row 4-6) */}
                    <div className="col-span-4 row-span-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-teal-400 hover:scale-105 transition-transform duration-300 animate-fadein delay-350 col-start-1 row-start-4">
                        <div className="flex items-center gap-3 mb-4">
                            <FaUserCircle className="text-2xl text-teal-400" />
                            <h2 className="text-lg font-bold text-teal-700">Well-being Tips for Patients</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={prevTip} className="text-2xl text-teal-400 hover:text-teal-600 transition">&#8592;</button>
                            <div className="text-gray-700 text-center w-72">{wellBeingTips[tipIndex]}</div>
                            <button onClick={nextTip} className="text-2xl text-teal-400 hover:text-teal-600 transition">&#8594;</button>
                        </div>
                    </div>
                    {/* Advice for Doctors - bottom right (col 5-6, row 4-6) */}
                    <div className="col-span-2 row-span-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-orange-400 hover:scale-105 transition-transform duration-300 animate-fadein delay-500 col-start-5 row-start-4">
                        <div className="flex items-center gap-3 mb-4">
                            <FaLightbulb className="text-2xl text-orange-400" />
                            <h2 className="text-lg font-bold text-orange-700">Advice for Doctors</h2>
                        </div>
                        <div className="text-gray-700 text-center">Stay updated with the latest medical research and guidelines. Remember to take breaks and care for your own well-being too!</div>
                    </div>
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
        .delay-100 { animation-delay: 0.1s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-250 { animation-delay: 0.25s; }
        .delay-350 { animation-delay: 0.35s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
        </div>
    );
};

export default DoctorDashboard;