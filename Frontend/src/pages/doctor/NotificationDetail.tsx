import React, { useState, useEffect } from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaRegHandPointRight } from 'react-icons/fa';



const NotificationDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    // State for dynamic report loading
    const [notif, setNotif] = useState<any>(location.state?.report || null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Patient profile state
    const [patientProfile, setPatientProfile] = useState<any>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const [patientHistory, setPatientHistory] = useState<any>(null);
    

    useEffect(() => {
        // If notif is already set (from navigation state or static), do nothing
        if (notif) return;
        if (!id) return;
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8020/reports/report-serviceget?reportID=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Report not found');
                return res.json();
            })
            .then(data => {
                setNotif(data);
                setLoading(false);
            })
            .catch(err => {
                setError('Notification not found.');
                setLoading(false);
            });
    }, [id]);

    // Fetch patient profile using email from notif
    useEffect(() => {
        if (!notif || !notif.email) return;
        setProfileLoading(true);
        setProfileError(null);
        const token = localStorage.getItem('token');
        fetch(`http://localhost:17000/patient/get/profile?email=${notif.email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Patient profile not found');
                return res.json();
            })
            .then(data => {
                setPatientProfile(data);
                setProfileLoading(false);
            })
            .catch(err => {
                setProfileError('Patient profile not found.');
                setProfileLoading(false);
            });
    }, [notif]);

    // Fetch patient history using email from notif
    useEffect(() => {
        if (!notif || !notif.email) return;
        const token = localStorage.getItem('token');
        fetch(`http://localhost:8020/reports/list?email=${notif.email}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch patient history');
                return res.json();
            })
            .then(data => {
                setPatientHistory(data);
            })
            .catch(err => {
                console.error(err);
            });
    }, [notif]);

    const [diagnosisResult, setDiagnosisResult] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [uploadingTB, setUploadingTB] = useState(false);
    const [tbResult, setTBResult] = useState<string | null>(null);
    const [selectedDisease, setSelectedDisease] = useState<'pneumonia' | 'tb' | 'anemia' | 'brain_tumor'>('pneumonia');
    const [file, setFile] = useState<File | null>(null);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-blue-700">Loading notification...</div>
                </div>
            </div>
        );
    }
    if (error || !notif) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-red-700">{error || 'Notification not found.'}</div>
                </div>
            </div>
        );
    }

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
                endpoint = 'http://localhost:9500/pneumonia/upload';
            } else if (selectedDisease === 'tb') {
                endpoint = 'http://localhost:9000/tb/upload';
            } else if (selectedDisease === 'anemia') {
                endpoint = 'http://localhost:5050/anemia/upload';
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
                const originalUrl = URL.createObjectURL(file);
                navigate('/doctor/brain-tumor-result', { state: { originalUrl, segmentedUrl } });
                return;
            }
            const data = await response.json();
           
            
            console.log(data)
            console.log("this is the id" + notif.id);

            if (selectedDisease === 'pneumonia') {
                setUploading(false);
                navigate('/doctor/diagnosis-result', { state: { result: data , profile: patientProfile , reportID : notif.id} } );
            } else if (selectedDisease === 'tb') {
                setUploadingTB(false);
                navigate('/doctor/diagnosis-result', { state: { result: data , profile: patientProfile , reportID : notif.id} } );
            } else if (selectedDisease === 'anemia') {
                setUploading(false);
                navigate('/doctor/diagnosis-result', { state: { result: data , profile: patientProfile , reportID : notif.id} } );
            }
        } catch (error) {
            if (selectedDisease === 'pneumonia' || selectedDisease === 'anemia' || selectedDisease === 'brain_tumor') setUploading(false);
            else setUploadingTB(false);
            alert('Failed to upload and process the report.');
        }
    };


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
                        Report Details
                    </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-4 gap-8 w-full max-w-7xl p-8">
                    {/* Patient Profile Tile (API + fallback to static profile) */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-purple-400 animate-fadein"
                        style={{ gridColumn: '4 / span 2', gridRow: '1 / span 2' }}>
                        <div className="text-xl font-bold text-purple-700 mb-2">Patient Profile</div>
                        {profileLoading ? (
                            <div className="text-blue-700">Loading patient profile...</div>
                        ) : profileError ? (
                            <div className="text-red-700">{profileError}</div>
                        ) : patientProfile ? (
                            <>
                                <div className="text-blue-900 font-semibold">Name: <span className="font-normal text-gray-800">{patientProfile.firstName + ' ' + patientProfile.lastName}</span></div>
                                <div className="text-blue-900 font-semibold">Age: <span className="font-normal text-gray-800">{patientProfile.age}</span></div>
                                <div className="text-blue-900 font-semibold">Gender: <span className="font-normal text-gray-800">{patientProfile.gender}</span></div>
                                <div className="text-blue-900 font-semibold">Allergies: <span className="font-normal text-gray-800">{patientProfile.allergies}</span></div>
                                <div className="text-blue-900 font-semibold">Restrictions: <span className="font-normal text-gray-800">{patientProfile.restrictions}</span></div>
                                <div className="text-blue-900 font-semibold">Medical Devices: <span className="font-normal text-gray-800">{patientProfile.medicalDevices}</span></div>
                                <div className="text-blue-900 font-semibold">Recent Surgery: <span className="font-normal text-gray-800">{patientProfile.recentSurgery}</span></div>
                                <div className="text-blue-900 font-semibold">Current Medications: <span className="font-normal text-gray-800">{patientProfile.currentMedications}</span></div>
                                <div className="text-blue-900 font-semibold">Primary Contact: <span className="font-normal text-gray-800">{patientProfile.primaryContactName} ({patientProfile.primaryContactPhone})</span></div>
                                <div className="text-blue-900 font-semibold">Secondary Contact: <span className="font-normal text-gray-800">{patientProfile.secondaryContactName} ({patientProfile.secondaryContactPhone})</span></div>
                            </>
                        ) : notif.profile ? (
                            <>
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
                            </>
                        ) : (
                            <div className="text-gray-500">No patient profile data available.</div>
                        )}
                    </div>
                    {/* X-ray/Report Tile - Auto-size to image/file preview */}
                    <div
                        className="col-span-3 row-span-3 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-blue-400 animate-fadein cursor-zoom-in"
                        onClick={() => notif.fileUrl && isImage(notif.fileUrl) && setShowModal(true)}
                        tabIndex={notif.fileUrl && isImage(notif.fileUrl) ? 0 : -1}
                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && notif.fileUrl && isImage(notif.fileUrl)) setShowModal(true); }}
                        aria-label="Zoom X-ray/Report"
                        style={{ gridColumn: '1 / span 3', gridRow: '1 / span 3' }}
                    >
                        <div className="text-xl font-bold text-blue-900 mb-4">Submitted X-ray / Report</div>
                        <div className="w-full flex flex-col items-center justify-center">
                            {notif.fileUrl ? (
                                isImage(notif.fileUrl) ? (
                                    <div className="flex items-center justify-center bg-gray-50 rounded-lg overflow-auto border border-gray-200 max-w-full max-h-[600px]">
                                        <img 
                                            src={notif.fileUrl} 
                                            alt="Report/X-ray" 
                                            className="object-contain"
                                            style={{ maxWidth: '100%', maxHeight: '600px', width: 'auto', height: 'auto', display: 'block' }}
                                        />
                                    </div>
                                ) : (
                                    <a href={notif.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File</a>
                                )
                            ) : (
                                <div className="text-gray-500 mb-4">No report or X-ray submitted.</div>
                            )}
                        </div>
                        {notif.fileUrl && isImage(notif.fileUrl) && <div className="text-xs text-blue-400 mt-2">Click to zoom</div>}
                    </div>
                    {/* Download Report/X-ray Tile */}
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 border-l-8 border-green-400 animate-fadein"
                        style={{ gridColumn: '6', gridRow: '1' }}>
                        <div className="text-lg font-bold text-green-700 mb-2">Download Report/X-ray</div>
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                            disabled={!notif.fileUrl}
                            onClick={() => { if (notif.fileUrl) window.open(notif.fileUrl, '_blank'); }}
                        >
                            Download
                        </button>
                        {!notif.fileUrl && <div className="text-gray-400 text-xs mt-2">No file available</div>}
                    </div>
                    {/* Patient History Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-pink-400 animate-fadein"
                        style={{ gridColumn: '4 / span 2', gridRow: '3 / span 2' }}>
                        <div className="text-xl font-bold text-pink-700 mb-2">Patient History</div>
                        {patientHistory && patientHistory.length > 0 ? (
                            <ul className="w-full">
                                {patientHistory.map((report, idx) => (
                                    <li key={idx} className="mb-2 p-2 bg-pink-50 rounded-lg">
                                        <span className="font-semibold text-blue-900">{report.date}</span> - <span className="text-gray-700">{report.type}</span>: <span className="text-gray-800">{report.summary}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No previous reports available.</div>
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
            {showModal && notif.fileUrl && isImage(notif.fileUrl) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh] flex items-center justify-center"
                        onClick={e => e.stopPropagation()}
                    >
                        <img 
                            src={notif.fileUrl} 
                            alt="Zoomed X-ray/Report" 
                            className="rounded-lg shadow-2xl max-h-[80vh] max-w-full transform transition-transform duration-300 scale-105 hover:scale-110"
                        />
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