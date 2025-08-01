import React, { useState } from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useParams, useNavigate } from 'react-router-dom';

const notifications = [
    { id: '1', patient: 'John Doe', message: 'Uploaded a new X-ray report.', detail: 'John Doe has uploaded a new X-ray report for your review. Please check the report and provide feedback.', file: 'https://via.placeholder.com/300x400?text=X-ray+Image', profile: { name: 'John Doe', age: 45, dob: '1979-01-01', gender: 'Male', email: 'john.doe@email.com', phone: '555-1234', address: '123 Main St, City', emergencyContact: 'Jane Doe (Wife) - 555-5678', insurance: 'HealthPlus', allergies: 'Penicillin', conditions: 'Asthma' }, history: [{ date: '2024-05-01', type: 'X-ray', summary: 'Normal' }, { date: '2024-03-15', type: 'Lab Report', summary: 'Elevated WBC' }] },
    { id: '2', patient: 'Jane Smith', message: 'Sent a follow-up question.', detail: 'Jane Smith has sent a follow-up question regarding her last diagnosis.', file: '', profile: { name: 'Jane Smith', age: 38, dob: '1986-02-14', gender: 'Female', email: 'jane.smith@email.com', phone: '555-5678', address: '456 Oak Ave, City', emergencyContact: 'John Smith (Husband) - 555-8765', insurance: 'MediCare', allergies: 'None', conditions: 'None' }, history: [{ date: '2024-04-10', type: 'X-ray', summary: 'Mild pneumonia' }] },
    { id: '3', patient: 'Ali Khan', message: 'Requested appointment reschedule.', detail: 'Ali Khan has requested to reschedule his upcoming appointment.', file: '', profile: { name: 'Ali Khan', age: 52, dob: '1972-07-22', gender: 'Male', email: 'ali.khan@email.com', phone: '555-8765', address: '789 Pine Rd, City', emergencyContact: 'Sara Khan (Daughter) - 555-4321', insurance: 'CarePlus', allergies: 'Sulfa drugs', conditions: 'Diabetes' }, history: [] },
    { id: '4', patient: 'Maria Garcia', message: 'Uploaded lab results.', detail: 'Maria Garcia has uploaded new lab results for your review.', file: 'https://via.placeholder.com/300x400?text=Lab+Report', profile: { name: 'Maria Garcia', age: 29, dob: '1995-11-03', gender: 'Female', email: 'maria.garcia@email.com', phone: '555-4321', address: '321 Maple St, City', emergencyContact: 'Carlos Garcia (Brother) - 555-1234', insurance: 'HealthFirst', allergies: 'None', conditions: 'None' }, history: [{ date: '2024-02-20', type: 'Lab Report', summary: 'All normal' }] },
];

const NotificationDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const notif = notifications.find(n => n.id === id);
    const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [uploadingTB, setUploadingTB] = useState(false);
    const [tbResult, setTBResult] = useState<string | null>(null);
    const [selectedDisease, setSelectedDisease] = useState<'pneumonia' | 'tb' | 'anemia' | 'brain_tumor'>('pneumonia');
    const [file, setFile] = useState<File | null>(null);

    const handleDiseaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDisease(e.target.value as 'pneumonia' | 'tb' | 'anemia' | 'brain_tumor');
        setFile(null);
        setDiagnosisResult(null);
        setTBResult(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setFile(e.target.files[0]);
    };

    const handleUnifiedUpload = async () => {
        if (!file) return;
        if (selectedDisease === 'pneumonia') {
            setUploading(true);
            setDiagnosisResult(null);
        } else if (selectedDisease === 'tb') {
            setUploadingTB(true);
            setTBResult(null);
        }
        const formData = new FormData();
        formData.append('image', file);
        try {
            let endpoint = '';
            if (selectedDisease === 'pneumonia') {
                endpoint = 'http://localhost:5051/pneumonia/upload/';
            } else if (selectedDisease === 'tb') {
                endpoint = 'http://localhost:5051/tb/upload/';
            } else if (selectedDisease === 'anemia') {
                endpoint = 'http://localhost:5051/anemia/upload';
            } else if (selectedDisease === 'brain_tumor') {
                endpoint = 'http://localhost:8000/segment';
            }
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            if (selectedDisease === 'brain_tumor') {
                // For brain tumor, get the blob (image)
                const blob = await response.blob();
                const segmentedUrl = URL.createObjectURL(blob);
                // Pass both original and segmented image URLs to the result page
                const originalUrl = URL.createObjectURL(file);
                navigate('/doctor/brain-tumor-result', { state: { originalUrl, segmentedUrl } });
                return;
            }
            const data = await response.json();
            if (selectedDisease === 'pneumonia') {
                setUploading(false);
                navigate('/doctor/diagnosis-result', { state: { result: data } });
            } else if (selectedDisease === 'tb') {
                setUploadingTB(false);
                navigate('/doctor/diagnosis-result', { state: { result: data } });
            } else if (selectedDisease === 'anemia') {
                setUploading(false);
                navigate('/doctor/diagnosis-result', { state: { result: data } });
            }
        } catch (error) {
            if (selectedDisease === 'pneumonia' || selectedDisease === 'anemia' || selectedDisease === 'brain_tumor') setUploading(false);
            else setUploadingTB(false);
            alert('Failed to upload and process the report.');
        }
    };

    // // Helper to check if file is an image (for modal zoom)
    // const isImage = (fileUrl: string) => {
    //     return fileUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) || fileUrl.includes('placeholder.com');
    // };

    const isImage = (fileUrl: string) => {
        if (!fileUrl) return false;

        const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
        const trustedImageDomains = ['placehold.co', 'your-own-cdn.com']; // update as needed

        return (
            imageExtensions.test(fileUrl) ||
            trustedImageDomains.some(domain => fileUrl.includes(domain))
        );
    };


    if (!notif) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-red-700">Notification not found.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-7xl px-8 pt-8 pb-2">
                    <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left mb-4">
                        Notification from {notif.patient}
                    </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-4 gap-8 w-full max-w-7xl p-8">
                    {/* X-ray/Report Tile */}
                    <div
                        className="col-span-3 row-span-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-blue-400 animate-fadein cursor-zoom-in"
                        onClick={() => notif.file && isImage(notif.file) && setShowModal(true)}
                        tabIndex={notif.file && isImage(notif.file) ? 0 : -1}
                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && notif.file && isImage(notif.file)) setShowModal(true); }}
                        aria-label="Zoom X-ray/Report"
                        style={{ gridColumn: '1 / span 3', gridRow: '1 / span 3' }}
                    >
                        <div className="text-xl font-bold text-blue-900 mb-4">Submitted X-ray / Report</div>
                        {notif.file ? (
                            <img src={notif.file} alt="Report/X-ray" className="rounded-lg shadow mb-4 max-h-96" />
                        ) : (
                            <div className="text-gray-500 mb-4">No report or X-ray submitted.</div>
                        )}
                        {notif.file && isImage(notif.file) && <div className="text-xs text-blue-400">Click to zoom</div>}
                    </div>
                    {/* Download Report/X-ray Tile */}
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 border-l-8 border-green-400 animate-fadein"
                        style={{ gridColumn: '6', gridRow: '1' }}>
                        <div className="text-lg font-bold text-green-700 mb-2">Download Report/X-ray</div>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            disabled={!notif.file}
                            onClick={() => { if (notif.file) window.open(notif.file, '_blank'); }}
                        >
                            Download
                        </button>
                        {!notif.file && <div className="text-gray-400 text-xs mt-2">No file available</div>}
                    </div>
                    {/* Patient Profile Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-purple-400 animate-fadein"
                        style={{ gridColumn: '4 / span 2', gridRow: '1 / span 2' }}>
                        <div className="text-xl font-bold text-purple-700 mb-2">Patient Profile</div>
                        <div className="text-blue-900 font-semibold">Name: <span className="font-normal text-gray-800">{notif.profile.name}</span></div>
                        <div className="text-blue-900 font-semibold">Age: <span className="font-normal text-gray-800">{notif.profile.age}</span></div>
                        <div className="text-blue-900 font-semibold">Date of Birth: <span className="font-normal text-gray-800">{notif.profile.dob}</span></div>
                        <div className="text-blue-900 font-semibold">Gender: <span className="font-normal text-gray-800">{notif.profile.gender}</span></div>
                        <div className="text-blue-900 font-semibold">Email: <span className="font-normal text-gray-800">{notif.profile.email}</span></div>
                        <div className="text-blue-900 font-semibold">Phone: <span className="font-normal text-gray-800">{notif.profile.phone}</span></div>
                        <div className="text-blue-900 font-semibold">Address: <span className="font-normal text-gray-800">{notif.profile.address}</span></div>
                        <div className="text-blue-900 font-semibold">Emergency Contact: <span className="font-normal text-gray-800">{notif.profile.emergencyContact}</span></div>
                        <div className="text-blue-900 font-semibold">Insurance: <span className="font-normal text-gray-800">{notif.profile.insurance}</span></div>
                        <div className="text-blue-900 font-semibold">Allergies: <span className="font-normal text-gray-800">{notif.profile.allergies}</span></div>
                        <div className="text-blue-900 font-semibold">Medical Conditions: <span className="font-normal text-gray-800">{notif.profile.conditions}</span></div>
                    </div>
                    {/* Patient History Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-pink-400 animate-fadein"
                        style={{ gridColumn: '4 / span 2', gridRow: '3 / span 2' }}>
                        <div className="text-xl font-bold text-pink-700 mb-2">Patient History</div>
                        {notif.history && notif.history.length > 0 ? (
                            <ul className="w-full">
                                {notif.history.map((h, idx) => (
                                    <li key={idx} className="mb-2 p-2 bg-pink-50 rounded-lg">
                                        <span className="font-semibold text-blue-900">{h.date}</span> - <span className="text-gray-700">{h.type}</span>: <span className="text-gray-800">{h.summary}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No previous reports.</div>
                        )}
                    </div>
                    {/* Upload to ML Model Tile */}
                    <div className="col-span-3 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-teal-400 animate-fadein"
                        style={{ gridColumn: '1 / span 3', gridRow: '4' }}>
                        <div className="w-full max-w-md flex flex-col items-center gap-4">
                            <div className="text-xl font-bold text-teal-700 mb-2">Upload Report/X-ray for Disease Detection</div>
                            <label className="w-full text-left font-semibold text-gray-700">Select Disease</label>
                            <select
                                className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                                value={selectedDisease}
                                onChange={handleDiseaseChange}
                            >
                                <option value="pneumonia">Pneumonia</option>
                                <option value="tb">TB</option>
                                <option value="anemia">Anemia</option>
                                <option value="brain_tumor">Brain Tumor Segmentation</option>
                            </select>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.pdf"
                                className="w-full mt-2"
                                onChange={handleFileChange}
                                disabled={uploading || uploadingTB}
                            />
                            <button
                                className={`w-full px-4 py-2 rounded-lg text-white transition disabled:opacity-50 ${selectedDisease === 'pneumonia' ? 'bg-blue-600 hover:bg-blue-700' : selectedDisease === 'tb' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                                disabled={uploading || uploadingTB || !file}
                                onClick={handleUnifiedUpload}
                            >
                                {(uploading || uploadingTB)
                                    ? 'Uploading...'
                                    : `Upload & Diagnose ${selectedDisease.charAt(0).toUpperCase() + selectedDisease.slice(1)}`}
                            </button>
                        </div>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back to Notifications</button>
            </div>
            {/* Modal for zoomed-in X-ray/Report */}
            {showModal && notif.file && isImage(notif.file) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh] flex items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img src={notif.file} alt="Zoomed X-ray/Report" className="rounded-lg shadow-2xl max-h-[80vh] max-w-full" />
                        <button
                            className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 text-xl text-gray-700 hover:text-red-600 focus:outline-none"
                            onClick={() => setShowModal(false)}
                            aria-label="Close zoomed view"
                        >
                            &times;
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

export default NotificationDetail; 