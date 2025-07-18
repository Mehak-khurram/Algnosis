import React, { useEffect, useState } from 'react';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import { User, Edit2, UploadCloud, Phone, AlertCircle } from 'lucide-react';

const initialPatientData = {
    name: 'John Doe',
    age: 32,
    gender: 'Male',
    allergies: 'Penicillin, Peanuts',
    medicalDevices: 'Pacemaker',
    recentSurgery: 'Appendectomy (2022)',
    dietaryRestrictions: 'Vegetarian',
    currentMedications: 'Aspirin, Metformin',
    emergencyContacts: [
        { name: 'Jane Doe', phone: '+1 555-123-4567', relation: 'Wife (Primary)' },
        { name: 'Robert Doe', phone: '+1 555-987-6543', relation: 'Brother (Secondary)' },
    ],
};

const tileDataFromPatient = (patient: typeof initialPatientData) => [
    {
        label: 'Age / Gender',
        value: `${patient.age} / ${patient.gender}`,
        icon: (
            <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6zm0-2a4 4 0 100-8 4 4 0 000 8z" /></svg>
        ),
        color: 'from-blue-100 to-blue-50',
    },
    {
        label: 'Allergies',
        value: patient.allergies || 'None',
        icon: (
            <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 1.343-3 3 0 1.657 1.343 3 3 3s3-1.343 3-3c0-1.657-1.343-3-3-3zm0 0V4m0 7v9" /></svg>
        ),
        color: 'from-pink-100 to-pink-50',
    },
    {
        label: 'Medical Devices',
        value: patient.medicalDevices || 'None',
        icon: (
            <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0h6" /></svg>
        ),
        color: 'from-blue-100 to-blue-50',
    },
    {
        label: 'Recent Surgery',
        value: patient.recentSurgery || 'None',
        icon: (
            <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-7 7-7-7" /></svg>
        ),
        color: 'from-blue-100 to-blue-50',
    },
    {
        label: 'Dietary Restrictions',
        value: patient.dietaryRestrictions || 'None',
        icon: (
            <svg className="w-7 h-7 text-pink-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        ),
        color: 'from-pink-100 to-pink-50',
    },
    {
        label: 'Current Medications',
        value: patient.currentMedications || 'None',
        icon: (
            <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 17l9-9M8 8h.01M16 16h.01" /></svg>
        ),
        color: 'from-blue-100 to-blue-50',
    },
];

const Dashboard: React.FC = () => {
    const [animate, setAnimate] = useState(false);
    const [patient, setPatient] = useState(initialPatientData);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(initialPatientData);

    useEffect(() => {
        setTimeout(() => setAnimate(true), 100);
    }, []);

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditContactChange = (idx: number, field: 'name' | 'phone' | 'relation', value: string) => {
        setEditData((prev) => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.map((c, i) => i === idx ? { ...c, [field]: value } : c),
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setPatient(editData);
        setEditOpen(false);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-[#f7f8fa]">
            <PatientNavBar />
            <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-8 py-10 px-4">
                {/* Profile Summary Card */}
                <div className="bg-white rounded-2xl shadow border border-gray-200 flex flex-col md:flex-row items-center gap-6 p-8 mb-2">
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                            <User className="w-12 h-12" />
                        </div>
                        <button
                            className="mt-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-blue-100 border border-blue-100"
                            onClick={() => { setEditData(patient); setEditOpen(true); }}
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col gap-2 items-center md:items-start">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{patient.name}</h1>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">Age: {patient.age}</span>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100">Gender: {patient.gender}</span>
                            {patient.allergies && <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-semibold border border-pink-100">Allergies: {patient.allergies}</span>}
                            {patient.medicalDevices && <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold border border-purple-100">Devices: {patient.medicalDevices}</span>}
                            {patient.recentSurgery && <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-semibold border border-yellow-100">Surgery: {patient.recentSurgery}</span>}
                            {patient.dietaryRestrictions && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold border border-green-100">Diet: {patient.dietaryRestrictions}</span>}
                        </div>
                    </div>
                </div>

                {/* Info Tiles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tileDataFromPatient(patient).map((tile, idx) => (
                        <div
                            key={tile.label}
                            className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-start min-h-[120px] group hover:border-blue-400 hover:shadow-md transition-all duration-200 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                            style={{ transitionDelay: `${idx * 80 + 200}ms` }}
                        >
                            <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600">{tile.icon}</div>
                            <span className="text-xs font-semibold uppercase mb-1 tracking-wider text-gray-500">{tile.label}</span>
                            <span className="text-lg font-bold text-gray-900 break-words">{tile.value}</span>
                        </div>
                    ))}
                    {/* Upload Report/X Ray tile */}
                    <a
                        href="/patient/upload-report"
                        className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[120px] group hover:border-blue-500 hover:bg-blue-100 transition-all duration-200"
                        style={{ transitionDelay: `${(tileDataFromPatient(patient).length + 1) * 80 + 200}ms` }}
                    >
                        <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                            <UploadCloud className="w-6 h-6" />
                        </div>
                        <span className="text-base font-bold text-blue-600 mb-1">Upload Report / X Ray</span>
                        <span className="text-xs text-gray-600 text-center">Upload your medical reports or X-rays securely</span>
                    </a>
                </div>

                {/* Emergency Contacts Card */}
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col gap-2 mt-8">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">Emergency Contacts</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-1">
                        {patient.emergencyContacts.map((contact, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border-b border-gray-100 pb-2 last:border-b-0">
                                <span className="font-semibold text-gray-900 flex items-center gap-1"><Phone className="w-4 h-4 text-blue-400" />{contact.name}</span>
                                <span className="text-gray-600">{contact.relation}</span>
                                <span className="text-blue-600 font-mono">{contact.phone}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Edit Modal */}
            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                    <form
                        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full p-8 relative flex flex-col gap-6"
                        onSubmit={handleSave}
                    >
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                            onClick={() => setEditOpen(false)}
                            type="button"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Information</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editData.name}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={editData.age}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={editData.gender}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                <input
                                    type="text"
                                    name="allergies"
                                    value={editData.allergies}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Devices</label>
                                <input
                                    type="text"
                                    name="medicalDevices"
                                    value={editData.medicalDevices}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recent Surgery</label>
                                <input
                                    type="text"
                                    name="recentSurgery"
                                    value={editData.recentSurgery}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                                <input
                                    type="text"
                                    name="dietaryRestrictions"
                                    value={editData.dietaryRestrictions}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                                <input
                                    type="text"
                                    name="currentMedications"
                                    value={editData.currentMedications}
                                    onChange={handleEditChange}
                                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contacts</label>
                            {editData.emergencyContacts.map((contact, idx) => (
                                <div key={idx} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={contact.name}
                                        onChange={e => handleEditContactChange(idx, 'name', e.target.value)}
                                        className="w-1/3 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        placeholder="Name"
                                    />
                                    <input
                                        type="text"
                                        value={contact.relation}
                                        onChange={e => handleEditContactChange(idx, 'relation', e.target.value)}
                                        className="w-1/3 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        placeholder="Relation"
                                    />
                                    <input
                                        type="text"
                                        value={contact.phone}
                                        onChange={e => handleEditContactChange(idx, 'phone', e.target.value)}
                                        className="w-1/3 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                        placeholder="Phone"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                                onClick={() => setEditOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 rounded-lg bg-blue-900 text-white font-semibold hover:bg-blue-800 transition"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </div>
    );
};

export default Dashboard; 