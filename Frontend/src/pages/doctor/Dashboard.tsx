import React, { useState, useEffect } from 'react';
import { FaUserMd, FaFileMedical, FaEdit, FaLightbulb, FaBell, FaCalendarCheck, FaChartLine, FaUsers, FaSyringe, FaClipboardList, FaStethoscope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';

const wellBeingTips = [
    'Encourage patients to stay hydrated and rest.',
    'Remind patients to follow up on their medications.',
    'Promote regular physical activity and healthy eating.',
    'Advise patients to get regular checkups.',
    'Share mental health resources and support.',
];

const DoctorDashboard: React.FC = () => {
    const [tipIndex, setTipIndex] = useState(0);
    const [recentReports, setRecentReports] = useState<any[]>([]);
    const [loadingReports, setLoadingReports] = useState(true);
    const [errorReports, setErrorReports] = useState<string | null>(null);
    const [doctorProfile, setDoctorProfile] = useState<any | null>(null);
    const navigate = useNavigate();

    const nextTip = () => setTipIndex((prevIndex) => (prevIndex + 1) % wellBeingTips.length);
    const prevTip = () => setTipIndex((prevIndex) => (prevIndex - 1 + wellBeingTips.length) % wellBeingTips.length);

    useEffect(() => {
        const fetchRecentReports = async () => {
            setLoadingReports(true);
            setErrorReports(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:8020/reports/doctor/list', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recent reports');
                }
                const data = await response.json();
                setRecentReports(data);
            } catch (error) {
                setErrorReports('Could not load recent reports.');
                console.error(error);
            } finally {
                setLoadingReports(false);
            }
        };

        const fetchDoctorProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:17000/doctor/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch doctor profile');
                }
                const data = await response.json();
                setDoctorProfile(data);
            } catch (error) {
                console.error('Error fetching doctor profile:', error);
            }
        };

        fetchRecentReports();
        fetchDoctorProfile();
    }, []);

    const tileClasses = "bg-white rounded-xl shadow-md p-6 flex flex-col justify-between cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2";
    const titleClasses = "text-xl font-semibold text-gray-800";
    const iconClasses = "text-3xl opacity-80";

    const renderProfileDetail = (label, value) => (
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">{label}:</span> {value || 'N/A'}
        </p>
    );

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col p-6 lg:p-12 animate-fade-in-up">
                <div className="w-full max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-slide-in-left">
                        Welcome, Dr. {doctorProfile?.firstName + " " + doctorProfile?.lastName || 'Smith'}
                    </h1>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                {renderProfileDetail('Specialization', doctorProfile?.specialization)}
                                {renderProfileDetail('Experience', `${doctorProfile?.yearsOfExperience || 'N/A'} years`)}
                                {renderProfileDetail('Qualifications', doctorProfile?.qualifications)}
                            </div>
                            <div>
                                {renderProfileDetail('Hospital', doctorProfile?.hospitalName)}
                                {renderProfileDetail('License Number', doctorProfile?.medicalLicenseNumber)}
                                {renderProfileDetail('Bio', doctorProfile?.shortBio)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Patients Overview */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-blue-50 to-blue-100 focus:ring-blue-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/my-patients')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/my-patients'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>My Patients</h2>
                            <FaUsers className={`${iconClasses} text-blue-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-4xl font-bold text-gray-900">42</div>
                            <div className="text-sm text-gray-500 mt-1">Active patients under your care</div>
                        </div>
                    </div>

                    {/* Pending Appointments */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-indigo-50 to-indigo-100 focus:ring-indigo-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/appointments')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/appointments'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Appointments</h2>
                            <FaCalendarCheck className={`${iconClasses} text-indigo-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-4xl font-bold text-gray-900">03</div>
                            <div className="text-sm text-gray-500 mt-1">Today's schedule</div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-red-50 to-red-100 focus:ring-red-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/notifications')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/notifications'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Notifications</h2>
                            <FaBell className={`${iconClasses} text-red-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-xl font-bold text-gray-900">No new notifications</div>
                            <div className="text-sm text-gray-500 mt-1">You're all caught up!</div>
                        </div>
                    </div>

                    {/* Quick Access: New Report */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-green-50 to-green-100 focus:ring-green-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/create-report')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/create-report'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Create New Report</h2>
                            <FaClipboardList className={`${iconClasses} text-green-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-lg font-bold text-gray-900">Start a new patient report</div>
                            <div className="text-sm text-gray-500 mt-1">Document a new consultation.</div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {/* Recent Reports - Main Panel */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 animate-fade-in-up delay-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <FaFileMedical className="text-3xl text-pink-500 mr-3" />
                                <h2 className="text-2xl font-bold text-pink-800">Recent Reports</h2>
                            </div>
                            <button
                                onClick={() => navigate('/doctor/all-reports')}
                                className="text-sm text-pink-600 hover:text-pink-800 font-semibold transition-colors duration-200"
                            >
                                View All
                            </button>
                        </div>
                        {loadingReports ? (
                            <p className="text-gray-500 text-center py-4">Loading recent reports...</p>
                        ) : errorReports ? (
                            <p className="text-red-500 text-center py-4">{errorReports}</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentReports.length > 0 ? (
                                            recentReports.slice(0, 5).map((report) => (
                                                <tr key={report.id} className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer" onClick={() => navigate(`/doctor/reports/${report.id}`, { state: { report } })}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.patientName}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{report.disease}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a href="#" className="text-pink-600 hover:text-pink-900">View</a>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-gray-500">No recent reports found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Side Panel (Right) */}
                    <div className="grid grid-cols-1 gap-6">
                        {/* Well-being Tips for Patients */}
                        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up delay-200">
                            <div className="flex items-center mb-4">
                                <FaStethoscope className="text-2xl text-teal-500 mr-2" />
                                <h2 className="text-xl font-bold text-teal-800">Health Tips</h2>
                            </div>
                            <div className="relative overflow-hidden h-20">
                                <div className="absolute transition-transform duration-500 ease-in-out" style={{ transform: `translateY(-${tipIndex * 100}%)` }}>
                                    {wellBeingTips.map((tip, index) => (
                                        <p key={index} className="text-gray-700 text-center text-sm mb-4 h-20 flex items-center justify-center px-4">
                                            {tip}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-center mt-2 space-x-2">
                                <button onClick={prevTip} className="text-gray-400 hover:text-teal-500 transition-colors duration-200">
                                    <FaChevronLeft className="text-xl" />
                                </button>
                                <button onClick={nextTip} className="text-gray-400 hover:text-teal-500 transition-colors duration-200">
                                    <FaChevronRight className="text-xl" />
                                </button>
                            </div>
                        </div>

                        {/* Professional Development */}
                        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up delay-300">
                            <div className="flex items-center mb-4">
                                <FaChartLine className="text-2xl text-purple-500 mr-2" />
                                <h2 className="text-xl font-bold text-purple-800">Professional Development</h2>
                            </div>
                            <p className="text-gray-700 text-sm">
                                Stay updated with the latest medical research and guidelines. Consider attending a conference or a new training to enhance your skills.
                            </p>
                            <button
                                onClick={() => navigate('/doctor/cme')}
                                className="mt-4 w-full bg-purple-100 text-purple-700 font-medium py-2 rounded-lg hover:bg-purple-200 transition-colors duration-200"
                            >
                                Find CME Courses
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.6s ease-out forwards;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in-left {
                    animation: slideInLeft 0.7s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DoctorDashboard;