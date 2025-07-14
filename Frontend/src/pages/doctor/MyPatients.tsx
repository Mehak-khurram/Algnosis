import React from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

const patients = [
  { name: 'John Doe', age: 45, gender: 'Male', status: 'Pneumonia (Recovered)' },
  { name: 'Jane Smith', age: 38, gender: 'Female', status: 'Under observation' },
  { name: 'Ali Khan', age: 52, gender: 'Male', status: 'Recent X-ray uploaded' },
  { name: 'Maria Garcia', age: 29, gender: 'Female', status: 'No recent issues' },
  { name: 'Wei Chen', age: 60, gender: 'Male', status: 'Needs follow-up' },
];

const MyPatients: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col relative overflow-hidden">
      <DoctorNavBar />
      {/* Animated background SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.10 }} aria-hidden="true">
        <circle cx="15%" cy="25%" r="70" fill="#60a5fa">
          <animate attributeName="cy" values="25%;35%;25%" dur="9s" repeatCount="indefinite" />
        </circle>
        <circle cx="85%" cy="80%" r="90" fill="#f472b6">
          <animate attributeName="cy" values="80%;70%;80%" dur="11s" repeatCount="indefinite" />
        </circle>
        <rect x="65%" y="15%" width="50" height="50" rx="18" fill="#fbbf24">
          <animate attributeName="y" values="15%;25%;15%" dur="13s" repeatCount="indefinite" />
        </rect>
        <circle cx="45%" cy="95%" r="35" fill="#34d399">
          <animate attributeName="cy" values="95%;85%;95%" dur="10s" repeatCount="indefinite" />
        </circle>
      </svg>
      {/* Main content (z-10) */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl px-8 pt-8 pb-2">
          <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left">
            My Patients
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl p-8">
          {patients.map((patient, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-xl border-l-8 border-blue-400 hover:scale-105 hover:shadow-2xl transition-transform duration-300 animate-fadein cursor-pointer flex flex-col items-center justify-center aspect-square min-h-[200px]"
              onClick={() => navigate(`/doctor/patient/${idx}`, { state: { patient } })}
            >
              <FaUser className="text-4xl text-blue-400 mb-3" />
              <div className="text-xl font-bold text-blue-900 mb-1">{patient.name}</div>
              <div className="text-gray-700 text-sm">Age: {patient.age} | {patient.gender}</div>
              <div className="text-blue-700 text-center font-medium mt-1">{patient.status}</div>
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

export default MyPatients; 