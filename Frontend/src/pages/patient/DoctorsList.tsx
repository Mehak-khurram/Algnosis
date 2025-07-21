import React, { useState } from 'react';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import {
    User,
    Heart,
    Stethoscope,
    Smile,
    Star,
    Phone,
    Mail,
    Activity,
    Calendar,
    FileText,
} from "lucide-react";

// Card, Button, Badge components (copied from Dashboard.tsx)
const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardDescription = ({ children, className }: any) => <div className={className}>{children}</div>;
const Button = ({ children, className, ...props }: any) => <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ''}`} {...props}>{children}</button>;
const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;

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
            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center items-center py-12 px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8 mt-8">Available Doctors</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 w-full">
                    {mockDoctors.map((doc, idx) => (
                        <Card
                            key={doc.id}
                            className="min-h-[220px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-blue-50/30 hover:scale-105 p-8 flex flex-col justify-between cursor-pointer animate-fadein-tile"
                            style={{ transitionDelay: `${idx * 100 + 200}ms` }}
                            onClick={() => setExpandedId(doc.id)}
                        >
                            <CardHeader className="pb-5 rounded-t-3xl flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                    <Stethoscope className="w-8 h-8" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-2xl font-bold text-gray-800">{doc.name}</span>
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    </div>
                                    <Badge className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border-0 rounded-full px-4 py-1 text-base">
                                        {doc.specialisation}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-lg text-blue-900 font-semibold">
                                    <User className="w-5 h-5 text-blue-500" />
                                    Experience: {doc.experience} years
                                </div>
                                <div className="flex items-center gap-2 text-base text-gray-700">
                                    <FileText className="w-5 h-5 text-indigo-500" />
                                    {doc.qualifications}
                                </div>
                                <div className="flex items-center gap-2 text-base text-gray-700">
                                    <Heart className="w-5 h-5 text-pink-500" />
                                    {doc.clinicName}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            {/* Expanded Doctor Modal */}
            {expandedDoctor && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadein">
                    <Card className="rounded-3xl shadow-2xl border-0 max-w-2xl w-full p-10 relative animate-fadein bg-gradient-to-br from-white to-blue-50/50">
                        <button
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-3xl font-bold"
                            onClick={() => setExpandedId(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <CardHeader className="flex items-center gap-6 mb-6">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                <Stethoscope className="w-10 h-10" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-3xl font-bold text-gray-800">{expandedDoctor.name}</span>
                                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                </div>
                                <Badge className="bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border-0 rounded-full px-4 py-1 text-lg">
                                    {expandedDoctor.specialisation}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-lg">
                            <div className="flex items-center gap-3 text-blue-900 font-semibold">
                                <User className="w-5 h-5 text-blue-500" />
                                Experience: {expandedDoctor.experience} years
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                Qualifications: {expandedDoctor.qualifications}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Heart className="w-5 h-5 text-pink-500" />
                                Clinic/Hospital: {expandedDoctor.clinicName}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Smile className="w-5 h-5 text-green-500" />
                                License #: {expandedDoctor.licenseNumber}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Phone className="w-5 h-5 text-blue-500" />
                                Contact: {expandedDoctor.contact}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Mail className="w-5 h-5 text-indigo-500" />
                                Email: {expandedDoctor.email}
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Activity className="w-5 h-5 text-purple-500" />
                                Bio: <span className="font-normal text-gray-800">{expandedDoctor.bio}</span>
                            </div>
                        </CardContent>
                        <Button
                            className={`w-full mt-6 px-8 py-4 rounded-2xl font-semibold text-white transition bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg text-xl ${selectedId === expandedDoctor.id ? 'ring-2 ring-pink-600' : ''}`}
                            onClick={() => { setSelectedId(expandedDoctor.id); setExpandedId(null); }}
                        >
                            {selectedId === expandedDoctor.id ? 'Selected' : 'Select Doctor'}
                        </Button>
                    </Card>
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
}

export default DoctorsList;