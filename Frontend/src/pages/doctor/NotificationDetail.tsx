import React, { useState, useEffect } from 'react';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaRegHandPointRight } from 'react-icons/fa';
import { FaDownload, FaMicroscope, FaStethoscope, FaUserMd, FaHistory, FaTimes, FaExpand } from 'react-icons/fa';
import { AiOutlineFileImage, AiOutlineUser, AiOutlineHistory, AiOutlineExperiment } from 'react-icons/ai';

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
    const [uploadDate, setUploadDate] = useState('');
    const [specialization, setSpecialization] = useState<string>("");



    // Fetch doctor's specialization
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:17000/doctor/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch doctor profile');
                return res.json();
            })
            .then(data => {
                setSpecialization(data.specialization || "");
            })
            .catch(err => {
                console.error(err);
                setSpecialization("");
            });
    }, []);

    // Set upload date when notif changes
    useEffect(() => {
        if (notif) {
            setUploadDate(new Date(notif.date).toLocaleDateString());
        }
    }, [notif]);

    const isImage = (fileUrl: string) => {
        if (!fileUrl) return false;
        const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
        return imageExtensions.test(fileUrl);
    };



    const handleDiagnoseWithModel = async (disease: 'pneumonia' | 'tb' | 'anemia' | 'brain_tumor') => {
        if (!notif || !notif.fileUrl || !isImage(notif.fileUrl)) {
            alert('No valid image report available to diagnose.');
            return;
        }
        setUploading(true);
        try {
            const imageResponse = await fetch(notif.fileUrl);
            if (!imageResponse.ok) throw new Error('Failed to fetch image from URL');
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

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                console.error('Failed to parse JSON response:', jsonError);
                throw new Error('Server returned invalid response format');
            }

            if (disease === 'brain_tumor') {
                if (data.error) {
                    throw new Error(data.error);
                }
                
                const originalUrl = URL.createObjectURL(imageFile);
                const segmentedUrl = data.segmented_image; // This is the base64 data URL

                navigate('/doctor/diagnosis-result', { 
                    state: { 
                        result: { diagnosis: data.diagnosis }, 
                        fileUrl: originalUrl,
                        segmentedUrl: segmentedUrl,
                        isBrainTumor: true,
                        profile: patientProfile, 
                        reportID: notif.id 
                    } 
                });
            } else {
                navigate('/doctor/diagnosis-result', { 
                    state: { 
                        result: data, 
                        profile: patientProfile, 
                        reportID: notif.id, 
                        fileUrl: notif.fileUrl 
                    } 
                });
            }
        } catch (error) {
            console.error('Error during diagnosis:', error);
            alert('Failed to upload and process the report for diagnosis.');
        } finally {
            setUploading(false);
        }
    };

        // Helper to determine which buttons to show
    const getDiagnosisButtons = () => {
        if (specialization.toLowerCase() === "pulmonology") {
            return (
                <>
                    <button
                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                        onClick={() => handleDiagnoseWithModel('pneumonia')}
                    >
                        <FaStethoscope /> {uploading ? 'Diagnosing...' : 'Pneumonia'}
                    </button>
                    <button
                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                        onClick={() => handleDiagnoseWithModel('tb')}
                    >
                        <FaMicroscope /> {uploading ? 'Diagnosing...' : 'Tuberculosis'}
                    </button>
                </>
            );
        }
        if (specialization.toLowerCase() === "neurology") {
            return (
                <button
                    className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                    onClick={() => handleDiagnoseWithModel('brain_tumor')}
                >
                    <FaRegHandPointRight /> {uploading ? 'Segmenting...' : 'Brain Tumor'}
                </button>
            );
        }
        if (specialization.toLowerCase() === "general physician") {
            return (
                <button
                    className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                    disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                    onClick={() => handleDiagnoseWithModel('anemia')}
                >
                    <FaUserMd /> {uploading ? 'Diagnosing...' : 'Anemia'}
                </button>
            );
        }
        // Default: show nothing or all
        return null;
    };



    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gray-50 flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-blue-700">Loading notification...</div>
                </div>
            </div>
        );
    }
    if (error || !notif) {
        return (
            <div className="min-h-screen w-full bg-gray-50 flex flex-col">
                <DoctorNavBar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-red-700">{error || 'Notification not found.'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans">
            <DoctorNavBar />
            <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
                {/* Header and Breadcrumbs */}
                <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/doctor/dashboard')}>Dashboard</span>
                            <span className="mx-2">&gt;</span>
                            <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/doctor/medical-reports')}>Medical Reports</span>
                            <span className="mx-2">&gt;</span>
                            <span className="font-semibold text-blue-800">Report Details</span>
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">Medical Diagnosis Report</h1>
                        <p className="text-gray-600 mt-1">Detailed analysis and AI-assisted diagnosis options</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 font-medium"
                        >
                            Back
                        </button>
                        <button
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                            disabled={!notif.fileUrl}
                            onClick={() => { if (notif.fileUrl) window.open(notif.fileUrl, '_blank'); }}
                        >
                            <FaDownload />
                            Download File
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Medical Report / Image Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 p-5 flex items-center justify-between border-b">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                                    <AiOutlineFileImage className="text-blue-600 text-2xl" />
                                    Medical Report
                                </h2>
                                {notif.fileUrl && isImage(notif.fileUrl) && (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-sm font-medium"
                                    >
                                        <FaExpand />
                                        View Fullscreen
                                    </button>
                                )}
                            </div>
                            <div className="relative p-6 flex items-center justify-center min-h-[400px] bg-gray-50">
                                {notif.fileUrl ? (
                                    isImage(notif.fileUrl) ? (
                                        <img
                                            src={notif.fileUrl}
                                            alt="Medical Report"
                                            className="object-contain max-h-[500px] w-full rounded-lg shadow-md transition-transform duration-300 hover:scale-[1.01]"
                                        />
                                    ) : (
                                        <div className="text-gray-500 text-center p-8">
                                            <a href={notif.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline font-medium">Click to view file</a>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-gray-500 text-center p-8">No report or X-ray submitted.</div>
                                )}
                            </div>
                            <div className="p-5 border-t bg-gray-100 flex justify-between items-center text-sm text-gray-600">
                                <span>File: <span className="font-medium text-gray-800">{notif.fileUrl ? notif.fileUrl.split('/').pop() : 'N/A'}</span></span>
                                <span>Uploaded: <span className="font-medium text-gray-800">{uploadDate || 'N/A'}</span></span>
                                <span>Type: <span className="font-medium text-gray-800">{notif.fileType || (notif.fileUrl && notif.fileUrl.split('.').pop().toUpperCase()) || 'N/A'}</span></span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="bg-gray-100 p-5 border-b flex items-center gap-3">
                                <AiOutlineExperiment className="text-teal-600 text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-800">AI-Powered Diagnosis</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">Leverage our AI models to get an initial analysis of the medical report. This is for informational purposes only and should not replace professional medical judgment.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {specialization.toLocaleLowerCase() === "pulmonology" && (<button
                                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                        onClick={() => handleDiagnoseWithModel('pneumonia')}
                                    >
                                        <FaStethoscope /> {uploading ? 'Diagnosing...' : 'Pneumonia'}
                                    </button>)}
                                    {specialization.toLocaleLowerCase() === "pulmonology" && (<button
                                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                        onClick={() => handleDiagnoseWithModel('tb')}
                                    >
                                        <FaMicroscope /> {uploading ? 'Diagnosing...' : 'Tuberculosis'}
                                    </button>)}
                                    {specialization.toLocaleLowerCase() === "general physician" && (<button
                                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                        onClick={() => handleDiagnoseWithModel('anemia')}
                                    >
                                        <FaUserMd /> {uploading ? 'Diagnosing...' : 'Anemia'}
                                    </button>)}
                                    {specialization.toLocaleLowerCase() === "neurology" && (<button
                                        className="px-4 py-3 rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
                                        disabled={uploading || !notif.fileUrl || !isImage(notif.fileUrl)}
                                        onClick={() => handleDiagnoseWithModel('brain_tumor')}
                                    >
                                        <FaRegHandPointRight /> {uploading ? 'Segmenting...' : 'Brain Tumor'}
                                    </button>)}
                                </div>
                                {!notif.fileUrl && (
                                    <p className="text-red-500 text-sm mt-4 text-center">No image available to diagnose.</p>
                                )}
                                {notif.fileUrl && !isImage(notif.fileUrl) && (
                                    <p className="text-orange-500 text-sm mt-4 text-center">Diagnosis is only available for image files.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Details Area */}
                    <div className="md:col-span-1 space-y-8">
                        {/* Patient Details Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="bg-gray-100 p-5 border-b flex items-center gap-3">
                                <AiOutlineUser className="text-purple-600 text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-800">Patient Details</h2>
                            </div>
                            <div className="p-6">
                                {profileLoading ? (
                                    <div className="text-center text-gray-500">Loading patient profile...</div>
                                ) : profileError ? (
                                    <div className="text-red-700 text-center">{profileError}</div>
                                ) : patientProfile ? (
                                    <div className="space-y-3 text-sm text-gray-700">
                                        <DetailItem label="Name" value={patientProfile.firstName + ' ' + patientProfile.lastName} />
                                        <DetailItem label="Age" value={patientProfile.age} />
                                        <DetailItem label="Gender" value={patientProfile.gender} />
                                        <DetailItem label="Allergies" value={patientProfile.allergies} />
                                        <DetailItem label="Restrictions" value={patientProfile.restrictions} />
                                        <DetailItem label="Medical Devices" value={patientProfile.medicalDevices} />
                                        <DetailItem label="Recent Surgery" value={patientProfile.recentSurgery} />
                                        <DetailItem label="Current Medications" value={patientProfile.currentMedications} />
                                        <DetailItem label="Primary Contact" value={`${patientProfile.primaryContactName} (${patientProfile.primaryContactPhone})`} />
                                        <DetailItem label="Secondary Contact" value={`${patientProfile.secondaryContactName} (${patientProfile.secondaryContactPhone})`} />
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center">No patient profile data available.</div>
                                )}
                            </div>
                        </div>

                        {/* Patient History Section */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                            <div className="bg-gray-100 p-5 border-b flex items-center gap-3">
                                <AiOutlineHistory className="text-blue-600 text-2xl" />
                                <h2 className="text-xl font-semibold text-gray-800">Patient History</h2>
                            </div>
                            <div className="p-6 max-h-64 overflow-y-auto">
                                {patientHistory && patientHistory.length > 0 ? (
                                    <ul className="space-y-4">
                                        {patientHistory.map((report: any, idx: number) => (
                                            <li key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <div className="text-sm">
                                                    <div className="font-semibold text-blue-900">Status: <span className="font-normal text-gray-800">{report.status}</span></div>
                                                    <div className="font-semibold text-blue-900 mt-1">Disease: <span className="font-normal text-gray-800">{report.disease}</span></div>
                                                    <div className="font-semibold text-blue-900 mt-1">Diagnosis: <span className="font-normal text-gray-800">{report.diagnosis}</span></div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-500 text-center">No previous reports available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for zoomed-in X-ray/Report */}
            {showModal && notif.fileUrl && isImage(notif.fileUrl) && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="relative max-w-6xl max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <img
                            src={notif.fileUrl}
                            alt="Zoomed Medical Report"
                            className="rounded-xl shadow-2xl max-h-[80vh] max-w-full"
                        />
                        <button
                            className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 text-xl text-gray-700 hover:text-red-600 transition-colors"
                            onClick={() => setShowModal(false)}
                            aria-label="Close zoomed view"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
    return (
        <p>
            <span className="font-medium text-gray-900">{label}:</span> <span className="text-gray-700">{value || 'N/A'}</span>
        </p>
    );
};

export default NotificationDetail;