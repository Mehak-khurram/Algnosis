import React, { useState } from 'react';
import PatientNavBar from '../../components/PatientNavBar.tsx';

const mockDoctors = [
    {
        id: 1,
        name: 'Dr. Sarah Ahmed',
        specialisation: 'Cardiologist',
        experience: 12,
        qualifications: 'MBBS, MD (Cardiology)',
        clinicName: 'Heart Care Clinic',
        licenseNumber: 'LIC123456',
        bio: 'Passionate about preventive cardiology and patient education.',
        contact: '+1 555-111-2222',
        email: 'sarah.ahmed@clinic.com',
    },
    {
        id: 2,
        name: 'Dr. Imran Khan',
        specialisation: 'Dentist',
        experience: 8,
        qualifications: 'BDS, MDS',
        clinicName: 'Smile Dental Studio',
        licenseNumber: 'LIC654321',
        bio: 'Expert in cosmetic and pediatric dentistry.',
        contact: '+1 555-333-4444',
        email: 'imran.khan@smilestudio.com',
    },
    {
        id: 3,
        name: 'Dr. Ayesha Siddiqui',
        specialisation: 'Dermatologist',
        experience: 10,
        qualifications: 'MBBS, MD (Dermatology)',
        clinicName: 'Skin Wellness Center',
        licenseNumber: 'LIC789012',
        bio: 'Focused on holistic skin health and advanced treatments.',
        contact: '+1 555-555-6666',
        email: 'ayesha.siddiqui@skinwellness.com',
    },
];

const DoctorsList: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const expandedDoctor = mockDoctors.find((doc) => doc.id === expandedId);

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-pink-50">
            <PatientNavBar />
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center items-center py-12 px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900 mb-8 mt-8">Available Doctors</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {mockDoctors.map((doc, idx) => (
                        <div
                            key={doc.id}
                            className={`bg-white rounded-2xl shadow-lg border border-blue-100 p-6 flex flex-col items-start transition-all duration-300 cursor-pointer relative hover:shadow-xl hover:-translate-y-1 animate-fadein-tile`}
                            onClick={() => setExpandedId(doc.id)}
                            style={{ minHeight: 180, transitionDelay: `${idx * 100 + 200}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-xl">
                                    {doc.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-900">{doc.name}</div>
                                    <div className="text-sm text-pink-600 font-semibold">{doc.specialisation}</div>
                                </div>
                            </div>
                            <div className="text-gray-700 text-sm mb-2">Experience: <span className="font-semibold text-blue-900">{doc.experience} years</span></div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Expanded Doctor Modal */}
            {expandedDoctor && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
                    <div className="bg-white rounded-2xl shadow-2xl border border-blue-200 max-w-lg w-full p-8 relative animate-fadein">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                            onClick={() => setExpandedId(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-2xl">
                                {expandedDoctor.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-900">{expandedDoctor.name}</div>
                                <div className="text-lg text-pink-600 font-semibold">{expandedDoctor.specialisation}</div>
                            </div>
                        </div>
                        <div className="mb-2 text-gray-700 text-sm">Experience: <span className="font-semibold text-blue-900">{expandedDoctor.experience} years</span></div>
                        <div className="mb-2 text-gray-700 text-sm">Qualifications: <span className="font-semibold text-blue-900">{expandedDoctor.qualifications}</span></div>
                        <div className="mb-2 text-gray-700 text-sm">Clinic/Hospital: <span className="font-semibold text-blue-900">{expandedDoctor.clinicName}</span></div>
                        <div className="mb-2 text-gray-700 text-sm">License #: <span className="font-semibold text-blue-900">{expandedDoctor.licenseNumber}</span></div>
                        <div className="mb-2 text-gray-700 text-sm">Contact: <span className="font-semibold text-blue-900">{expandedDoctor.contact}</span></div>
                        <div className="mb-2 text-gray-700 text-sm">Email: <span className="font-semibold text-blue-900">{expandedDoctor.email}</span></div>
                        <div className="mb-4 text-gray-700 text-sm">Bio: <span className="font-normal text-gray-800">{expandedDoctor.bio}</span></div>
                        <button
                            className={`w-full mt-2 px-6 py-3 rounded-lg font-semibold text-white transition bg-blue-900 hover:bg-blue-800 shadow ${selectedId === expandedDoctor.id ? 'ring-2 ring-pink-600' : ''}`}
                            onClick={() => { setSelectedId(expandedDoctor.id); setExpandedId(null); }}
                        >
                            {selectedId === expandedDoctor.id ? 'Selected' : 'Select Doctor'}
                        </button>
                    </div>
                </div>
            )}
            <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.5s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeinTile {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein-tile {
          animation: fadeinTile 0.7s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </div>
    );
};

export default DoctorsList; 