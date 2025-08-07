import React, { useState, useEffect } from 'react';
import { FaUserMd, FaFileMedical, FaClipboardCheck, FaHourglassHalf, FaEdit, FaLightbulb, FaBell, FaCalendarCheck, FaChartLine, FaUsers, FaSyringe, FaClipboardList, FaStethoscope, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Chart components
const CustomBarChart: React.FC<{ data: { week: string; count: number }[]; title: string }> = ({ data, title }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-3">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <div className="w-16 text-sm text-gray-600">{item.week}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-6">
                            <div 
                                className="bg-blue-500 h-6 rounded-full transition-all duration-300"
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                            ></div>
                        </div>
                        <div className="w-12 text-sm font-semibold text-gray-700">{item.count}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CustomPieChart: React.FC<{ data: { label: string; count: number; color: string }[]; title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    // Debug: Log the data to see what we're working with
    console.log('PieChart Data:', data);
    console.log('Total:', total);
    
    // If no data, show a message
    if (total === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
                <div className="text-center py-8 text-gray-500">
                    No data available for this chart
                </div>
            </div>
        );
    }
    
    // Convert data to Recharts format
    const pieData = data.map(item => ({
        name: item.label,
        value: item.count,
        color: item.color
    }));
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                    >
                        {pieData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

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
    const [patientCount, setPatientCount] = useState<number>(0);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const navigate = useNavigate();

    const nextTip = () => setTipIndex((prevIndex) => (prevIndex + 1) % wellBeingTips.length);
    const prevTip = () => setTipIndex((prevIndex) => (prevIndex - 1 + wellBeingTips.length) % wellBeingTips.length);

    // Helper function to get week ranges for the current month
    const getWeekRanges = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const weeks: { week: string; start: Date; end: Date; range: string }[] = [];
        
        let currentDate = new Date(firstDay);
        let weekNum = 1;
        
        while (currentDate <= lastDay) {
            const weekStart = new Date(currentDate);
            const weekEnd = new Date(currentDate);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            if (weekEnd > lastDay) {
                weekEnd.setTime(lastDay.getTime());
            }
            
            weeks.push({
                week: `Week ${weekNum}`,
                start: weekStart,
                end: weekEnd,
                range: `${weekStart.getDate()}-${weekEnd.getDate()}`
            });
            
            currentDate.setDate(currentDate.getDate() + 7);
            weekNum++;
        }
        
        return weeks;
    };

    // Helper function to process reports data for charts
    const processReportsData = (reports: any[]) => {
        const weekRanges = getWeekRanges();
        const weeklyData = weekRanges.map(week => ({
            week: week.range,
            count: reports.filter(report => {
                const reportDate = new Date(report.createdAt);
                return reportDate >= week.start && reportDate <= week.end;
            }).length
        }));

        return { weeklyData };
    };

    // Helper function to get diagnosis data based on specialization
    const getDiagnosisData = (reports: any[], specialization: string) => {
        if (specialization === 'General Physician') {
            // Only consider reports with a non-null diagnosis
            const diagnosedReports = reports.filter(r => r.diagnosis && typeof r.diagnosis === 'string');
            const nonAnemicCount = diagnosedReports.filter(r => {
                const diag = r.diagnosis.toLowerCase();
                return diag.includes('not anemic') || diag.includes('non-anemic');
            }).length;
            const anemicCount = diagnosedReports.filter(r => {
                const diag = r.diagnosis.toLowerCase();
                return diag.includes('anemic') && !diag.includes('not anemic') && !diag.includes('non-anemic');
            }).length;
            
            return {
                type: 'single',
                data: [{
                    label: 'Anemic',
                    count: anemicCount,
                    color: '#ef4444'
                }, {
                    label: 'Non-Anemic',
                    count: nonAnemicCount,
                    color: '#10b981'
                }]
            };
        } else if (specialization === 'Pulmonology') {
            const pneumoniaReports = reports.filter(r => r.disease === 'PNEUMONIA');
            const pneumoniaData = [
                {
                    label: 'Pneumonia',
                    count: pneumoniaReports.filter(r => 
                        r.diagnosis && (r.diagnosis.toLowerCase().includes('pneumonia') || r.diagnosis.toLowerCase().includes('positive'))
                    ).length,
                    color: '#3b82f6'
                },
                {
                    label: 'Non-Pneumonia',
                    count: pneumoniaReports.filter(r => 
                        r.diagnosis && (r.diagnosis.toLowerCase().includes('non pneumonia') || r.diagnosis.toLowerCase().includes('non-pneumonia') || r.diagnosis.toLowerCase().includes('negative') || r.diagnosis.toLowerCase().includes('normal'))
                    ).length,
                    color: '#10b981'
                }
            ];
            
            const tbReports = reports.filter(r => r.disease === 'TB');
            const tbData = [
                {
                    label: 'TB',
                    count: tbReports.filter(r => 
                        r.diagnosis && (r.diagnosis.toLowerCase().includes('tb') || r.diagnosis.toLowerCase().includes('positive'))
                    ).length,
                    color: '#f59e0b'
                },
                {
                    label: 'Non-TB',
                    count: tbReports.filter(r => 
                        r.diagnosis && (r.diagnosis.toLowerCase().includes('non tb') || r.diagnosis.toLowerCase().includes('non-tb') || r.diagnosis.toLowerCase().includes('negative') || r.diagnosis.toLowerCase().includes('normal'))
                    ).length,
                    color: '#10b981'
                }
            ];
            
            return { type: 'double', pneumoniaData, tbData };
        } else if (specialization === 'Neurology') {
            console.log('Brain Tumor Reports:', reports);
            const brainTumorReports = reports.filter(r => r.disease === 'BRAIN_TUMOR');
            console.log('Filtered Brain Tumor Reports:', brainTumorReports);
            
            const brainTumorCount = brainTumorReports.filter(r => {
                if (!r.diagnosis) return false;
                const diagLower = r.diagnosis.toLowerCase();
                console.log('Checking diagnosis for tumor:', r.diagnosis, 'lowercase:', diagLower);
                return diagLower.includes('tumor detected') || diagLower.includes('positive');
            }).length;
            
            const nonBrainTumorCount = brainTumorReports.filter(r => {
                if (!r.diagnosis) return false;
                const diagLower = r.diagnosis.toLowerCase();
                console.log('Checking diagnosis for no tumor:', r.diagnosis, 'lowercase:', diagLower);
                return diagLower.includes('no tumor detected') || diagLower.includes('non-brain tumor') || diagLower.includes('negative') || diagLower.includes('normal');
            }).length;
            
            console.log('Brain Tumor Count:', brainTumorCount);
            console.log('Non-Brain Tumor Count:', nonBrainTumorCount);
            
            return {
                type: 'single',
                data: [{
                    label: 'Brain Tumor',
                    count: brainTumorCount,
                    color: '#8b5cf6'
                }, {
                    label: 'Non-Brain Tumor',
                    count: nonBrainTumorCount,
                    color: '#10b981'
                }]
            };
        }
        
        return { type: 'single', data: [] };
    };

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
        fetchPatientCount();
    }, []);

    const fetchPatientCount = async () => {
        setLoadingPatients(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:17000/doctor/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch patients');
            }
            const data = await response.json();
            console.log('Patients data for count:', data);
            setPatientCount(Array.isArray(data) ? data.length : 0);
        } catch (error) {
            console.error('Error fetching patient count:', error);
            setPatientCount(0); // Fallback to 0 on error
        } finally {
            setLoadingPatients(false);
        }
    };

    const tileClasses = "bg-white rounded-xl shadow-md p-6 flex flex-col justify-between cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2";
    const titleClasses = "text-xl font-semibold text-gray-800";
    const iconClasses = "text-3xl opacity-80";

    const renderProfileDetail = (label, value) => (
        <p className="text-gray-600 mb-2">
            <span className="font-semibold">{label}:</span> {value || 'N/A'}
        </p>
    );
    const totalReports = recentReports.length;
    
    // Debug: Log all unique statuses to understand what values exist
    const uniqueStatuses = [...new Set(recentReports.map(r => r.status))];
    console.log('All unique statuses in reports:', uniqueStatuses);
    
    // Try both case variations for status matching
    const completedReports = recentReports.filter(r => 
        r.status === 'Completed' || r.status === 'completed' || r.status === 'COMPLETED'
    ).length;
    
    const pendingReports = recentReports.filter(r => 
        r.status === 'pending' || r.status === 'Pending' || r.status === 'PENDING'
    ).length;
    
    console.log('Total Reports:', totalReports);
    console.log('Completed Reports:', completedReports);
    console.log('Pending Reports:', pendingReports);

    // Process data for charts
    const { weeklyData } = processReportsData(recentReports);
    const diagnosisData = getDiagnosisData(recentReports, doctorProfile?.specialization);
    
    // Debug: Log the reports data to understand the structure
    console.log('Recent Reports:', recentReports);
    console.log('Doctor Specialization:', doctorProfile?.specialization);
    console.log('Diagnosis Data:', diagnosisData);

    const rechartsWeeklyData = weeklyData.map(week => ({
        name: week.week,
        Reports: week.count,
    }));

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
                            <div className="text-4xl font-bold text-gray-900">
                                {loadingPatients ? '...' : patientCount}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Active patients under your care</div>
                        </div>
                    </div>

                    {/* Total Reports */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-indigo-50 to-indigo-100 focus:ring-indigo-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/notifications')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/notifications'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Total Reports</h2>
                            <FaFileMedical className={`${iconClasses} text-indigo-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-4xl font-bold text-gray-900">{totalReports}</div>
                            <div className="text-sm text-gray-500 mt-1">Reports received</div>
                        </div>
                    </div>

                    {/* Completed Reports */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-green-50 to-green-100 focus:ring-green-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/notifications?status=completed')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/notifications?status=completed'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Completed Reports</h2>
                            <FaClipboardCheck className={`${iconClasses} text-green-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-4xl font-bold text-gray-900">{completedReports}</div>
                            <div className="text-sm text-gray-500 mt-1">Reports completed</div>
                        </div>
                    </div>

                    {/* Pending Reports */}
                    <div
                        className={`${tileClasses} bg-gradient-to-br from-yellow-50 to-yellow-100 focus:ring-yellow-500`}
                        tabIndex={0}
                        onClick={() => navigate('/doctor/notifications?status=pending')}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/doctor/notifications?status=pending'); }}
                    >
                        <div className="flex items-start justify-between">
                            <h2 className={titleClasses}>Pending Reports</h2>
                            <FaHourglassHalf className={`${iconClasses} text-yellow-500`} />
                        </div>
                        <div className="mt-4">
                            <div className="text-4xl font-bold text-gray-900">{pendingReports}</div>
                            <div className="text-sm text-gray-500 mt-1">Reports pending</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                {doctorProfile?.specialization && (
                    <div className="w-full max-w-7xl mx-auto mt-6">
                        {/* Layout for Pulmonology - Curve chart in one row, two pie charts in next row */}
                        {doctorProfile.specialization === 'Pulmonology' && (
                            <>
                                {/* Line Chart - Reports per Week (Full Width Row) */}
                                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Reports Received per Week (This Month)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={rechartsWeeklyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="Reports" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Two Pie Charts Row */}
                                {diagnosisData.type === 'double' && diagnosisData.pneumoniaData && diagnosisData.tbData && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <CustomPieChart 
                                            data={diagnosisData.pneumoniaData} 
                                            title="Pneumonia Diagnosis Distribution" 
                                        />
                                        <CustomPieChart 
                                            data={diagnosisData.tbData} 
                                            title="TB Diagnosis Distribution" 
                                        />
                                    </div>
                                )}
                            </>
                        )}
                        
                        {/* Layout for General Physician and Neurology - Curve chart and pie chart in same row */}
                        {(doctorProfile.specialization === 'General Physician' || doctorProfile.specialization === 'Neurology') && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Line Chart */}
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Reports Received per Week (This Month)</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={rechartsWeeklyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="Reports" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                                
                                {/* Pie Chart */}
                                {doctorProfile.specialization === 'General Physician' && diagnosisData.type === 'single' && diagnosisData.data && (
                                    <CustomPieChart 
                                        data={diagnosisData.data} 
                                        title="Anemia Diagnosis Distribution" 
                                    />
                                )}
                                
                                {doctorProfile.specialization === 'Neurology' && diagnosisData.type === 'single' && diagnosisData.data && (
                                    <CustomPieChart 
                                        data={diagnosisData.data} 
                                        title="Brain Tumor Diagnosis Distribution" 
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-6 mt-6">
                    {/* Recent Reports - Main Panel (full width) */}
                    <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in-up delay-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <FaFileMedical className="text-3xl text-pink-500 mr-3" />
                                <h2 className="text-2xl font-bold text-pink-800">Recent Reports</h2>
                            </div>
                            <button
                                onClick={() => navigate('/doctor/notifications')}
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
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disease</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentReports.length > 0 ? (
                                            recentReports.slice(0, 5).map((report) => (
                                                <tr
                                                    key={report.id}
                                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                                    onClick={() => navigate(`/doctor/notifications/${report.id}`, { state: { report } })}
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{report.id}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{report.disease}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{report.diagnosis || 'Pending'}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{report.status}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button
                                                            className="text-pink-600 hover:text-pink-800 underline"
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                navigate(`/doctor/notifications/${report.id}`, { state: { report } });
                                                            }}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-4 text-gray-500">No recent reports found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
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