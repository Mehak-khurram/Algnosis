import React, { useState, useEffect } from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaRegHandPointRight } from 'react-icons/fa'; // Keep this if you use it elsewhere, though it's not in the current snippet's UI

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
    const [zoomedImage, setZoomedImage] = useState<string | null>(null); // This state is not currently used in the provided UI.
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
        console.log('Fetching patient history for email:', notif.email);
        fetch(`http://localhost:8020/reports/get/email?email=${notif.email}`, {
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

    const [uploading, setUploading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const isImage = (fileUrl: string) => {
        if (!fileUrl) return false;
        const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
        const trustedImageDomains = ['placehold.co', 'your-own-cdn.com']; // update as needed
        return (
            imageExtensions.test(fileUrl) ||
            trustedImageDomains.some(domain => fileUrl.includes(domain))
        );
    };

    const handleDiagnoseWithModel = async (disease: 'pneumonia' | 'tb' | 'anemia' | 'brain_tumor') => {
        if (!notif || !notif.fileUrl || !isImage(notif.fileUrl)) {
            alert('No valid image report available to diagnose.');
            return;
        }

        setUploading(true);

        try {
            // Fetch the image from the URL
            const imageResponse = await fetch(notif.fileUrl);
            if (!imageResponse.ok) {
                throw new Error('Failed to fetch image from URL');
            }
            const imageBlob = await imageResponse.blob();
            const imageFile = new File([imageBlob], 'report_image.jpg', { type: imageBlob.type });

            const formData = new FormData();
            formData.append('image', imageFile);

            let endpoint = '';
            switch (disease) {
                case 'pneumonia':
                    endpoint = 'http://localhost:9500/pneumonia/upload';
                    break;
                case 'tb':
                    endpoint = 'http://localhost:9000/tb/upload';
                    break;
                case 'anemia':
                    endpoint = 'http://localhost:5050/anemia/upload';
                    break;
                case 'brain_tumor':
                    endpoint = 'http://localhost:8000/segment';
                    break;
                default:
                    throw new Error('Invalid disease selected');
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            if (disease === 'brain_tumor') {
                const blob = await response.blob();
                const segmentedUrl = URL.createObjectURL(blob);
                const originalUrl = URL.createObjectURL(imageFile); // Use imageFile for original
                navigate('/doctor/brain-tumor-result', { state: { originalUrl, segmentedUrl } });
                return;
            }

            const data = await response.json();
            console.log(data);
            console.log("this is the id" + notif.id);

            navigate('/doctor/diagnosis-result', { state: { result: data, profile: patientProfile, reportID: notif.id, fileUrl: notif.fileUrl } });

        } catch (error) {
            console.error('Error during diagnosis:', error);
            alert('Failed to upload and process the report for diagnosis.');
        } finally {
            setUploading(false);
        }
    };

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

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-7xl px-8 pt-8 pb-2">
                    {/* Breadcrumbs-like navigation, adjust as needed */}
                    <div className="text-sm text-gray-600 mb-4 flex items-center">
                        <span className="cursor-pointer hover:underline" onClick={() => navigate('/doctor/dashboard')}>Dashboard</span>
                        <span className="mx-2">&gt;</span>
                        <span className="cursor-pointer hover:underline" onClick={() => navigate('/doctor/medical-reports')}>Medical Reports</span>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-blue-800">Chest X-ray Report</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-3xl font-bold text-blue-900 animate-fadein-left z-10 text-left">
                            Medical Diagnosis Report
                        </div>
                        <button
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            disabled={!notif.fileUrl}
                            onClick={() => { if (notif.fileUrl) window.open(notif.fileUrl, '_blank'); }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download PDF
                        </button>
                    </div>
                    <p className="text-gray-700 mb-6">Chest X-ray Examination results and diagnosis</p>
                </div>

                <div className="grid grid-cols-3 gap-6 w-full max-w-7xl px-8 pb-8"> {/* Adjusted grid for the new layout */}

                    {/* Chest X-ray Image / Report Section */}
                    <div className="col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gray-100 p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l1.59-1.59a2.25 2.25 0 0 1 3.18 0l2.478 2.478a2.25 2.25 0 0 0 3.18 0l.961-.961m1.517 3.283a2.25 2.25 0 0 0 3.18 0l1.59-1.59m-5.875 1.5l1.59 1.59c.228.228.49.49.778.778l2.478 2.478a2.25 2.25 0 0 0 3.18 0l.961-.961M12 12.75l.961.961c.288.288.55.55.778.778l1.59 1.59a2.25 2.25 0 0 0 3.18 0l1.59-1.59M3 16.5h18" />
                                </svg>
                                Chest X-ray Image
                            </h2>
                            <span className="text-sm text-gray-500">Uploaded: 25/07/2025</span> {/* Placeholder for upload date */}
                        </div>
                        <div
                            className="relative flex items-center justify-center p-4 bg-gray-50 cursor-zoom-in min-h-[400px]"
                            onClick={() => notif.fileUrl && isImage(notif.fileUrl) && setShowModal(true)}
                            tabIndex={notif.fileUrl && isImage(notif.fileUrl) ? 0 : -1}
                            onKeyDown={e => { if ((e.key === 'Enter' || e.key === ' ') && notif.fileUrl && isImage(notif.fileUrl)) setShowModal(true); }}
                            aria-label="Zoom X-ray/Report"
                        >
                            {notif.fileUrl ? (
                                isImage(notif.fileUrl) ? (
                                    <img
                                        src={notif.fileUrl}
                                        alt="Report/X-ray"
                                        className="object-contain max-h-[500px] w-full"
                                    />
                                ) : (
                                    <a href={notif.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-center p-8">View File</a>
                                )
                            ) : (
                                <div className="text-gray-500 text-center p-8">No report or X-ray submitted.</div>
                            )}
                            {notif.fileUrl && isImage(notif.fileUrl) && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                                    Chest X-ray - Anterior View
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center p-4 text-sm text-gray-600 border-t border-gray-200">
                            <span>File Size: {notif.fileSize || 'N/A'}</span> {/* Add fileSize to your notif state if available */}
                            <span>Dimensions: {notif.dimensions || 'N/A'}</span> {/* Add dimensions to your notif state if available */}
                            <span>Format: {notif.fileType || (notif.fileUrl && notif.fileUrl.split('.').pop().toUpperCase()) || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Patient Details Section */}
                    <div className="col-span-1 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            Patient Details
                        </h2>
                        {profileLoading ? (
                            <div className="text-blue-700">Loading patient profile...</div>
                        ) : profileError ? (
                            <div className="text-red-700">{profileError}</div>
                        ) : patientProfile ? (
                            <div className="text-sm text-gray-700 space-y-2">
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
                            </div>
                        ) : notif.profile ? (
                            <div className="text-sm text-gray-700 space-y-2">
                                <p><span className="font-medium text-blue-900">Name:</span> {notif.profile.name}</p>
                                <p><span className="font-medium text-blue-900">Age:</span> {notif.profile.age}</p>
                                <p><span className="font-medium text-blue-900">Gender:</span> {notif.profile.gender}</p>
                                <p><span className="font-medium text-blue-900">Email:</span> {notif.profile.email}</p>
                                <p><span className="font-medium text-blue-900">Phone:</span> {notif.profile.phone}</p>
                                <p><span className="font-medium text-blue-900">Allergies:</span> {notif.profile.allergies}</p>
                                <p><span className="font-medium text-blue-900">Medical Conditions:</span> {notif.profile.conditions}</p>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-sm">No patient profile data available.</div>
                        )}
                    </div>

                    {/* Diagnose with ML Model Section (formerly Diagnosis Summary) */}
                    <div className="col-span-2 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25M7.5 10.5h.008v.008H7.5V10.5Zm2.25 0h.008v.008H9.75V10.5Zm2.25 0h.008v.008h-.008V10.5Zm2.25 0h.008v.008h-.008V10.5Zm-4.5 4.5h.008v.008H7.5V15Zm2.25 0h.008v.008H9.75V15Zm2.25 0h.008v.008h-.008V15Zm2.25 0h.008v.008h-.008V15Z" />
                            </svg>
                            Diagnose with AI Models
                        </h2>
                        <div className="grid grid-cols-2 gap-4 w-full">
                            <button
                                className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                onClick={() => handleDiagnoseWithModel('pneumonia')}
                            >
                                {uploading ? 'Diagnosing...' : 'Diagnose Pneumonia'}
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                onClick={() => handleDiagnoseWithModel('tb')}
                            >
                                {uploading ? 'Diagnosing...' : 'Diagnose TB'}
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                onClick={() => handleDiagnoseWithModel('anemia')}
                            >
                                {uploading ? 'Diagnosing...' : 'Diagnose Anemia'}
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                onClick={() => handleDiagnoseWithModel('brain_tumor')}
                            >
                                {uploading ? 'Segmenting...' : 'Brain Tumor Segmentation'}
                            </button>
                        </div>
                        {!notif.fileUrl && (
                            <p className="text-red-500 text-sm mt-4 text-center">No image available to diagnose.</p>
                        )}
                        {notif.fileUrl && !isImage(notif.fileUrl) && (
                            <p className="text-orange-500 text-sm mt-4 text-center">Current file is not an image (e.g., PDF). Diagnosis is only available for image files.</p>
                        )}
                    </div>

                    {/* Patient History Section (formerly Reviewing Physician) */}
                    <div className="col-span-1 bg-white rounded-lg shadow-md p-6 h-64 overflow-y-auto">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            Patient History
                        </h2>
                        {patientHistory && patientHistory.length > 0 ? (
                            <ul className="w-full">
                                {patientHistory.map((report, idx) => (
                                    <li key={idx} className="mb-2 p-2 bg-pink-50 rounded-lg">
                                        <span className="font-semibold text-blue-900">Status:</span> {report.status}<br />
                                        <span className="font-semibold text-blue-900">Disease:</span> {report.disease}<br />
                                        <span className="font-semibold text-blue-900">Diagnosis:</span> {report.diagnosis}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No previous reports available.</div>
                        )}
                    </div>
                </div>

                <button onClick={() => navigate(-1)} className="mt-6 mb-8 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                    Back to Notifications
                </button>
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