import React, { useState, useEffect } from "react";
import { FileText, Calendar, ChevronRight, User, Search } from "lucide-react";
import DoctorNavBar from "../../components/DoctorNavBar.tsx";
import { useNavigate } from "react-router-dom";

const allReports = [
    {
        id: 1,
        patient: 'John Doe',
        diagnosis: 'Pneumonia',
        date: '2025-07-25',
        preview: 'https://via.placeholder.com/400x250?text=X-ray+Preview',
    },
    {
        id: 2,
        patient: 'Jane Smith',
        diagnosis: 'Tuberculosis',
        date: '2025-07-24',
        preview: 'https://via.placeholder.com/400x250?text=CT+Scan+Preview',
    },
    {
        id: 3,
        patient: 'Ali Khan',
        diagnosis: 'Brain Tumor',
        date: '2025-07-22',
        preview: 'https://via.placeholder.com/400x250?text=MRI+Preview',
    },
    {
        id: 4,
        patient: 'Maria Garcia',
        diagnosis: 'Anemia',
        date: '2025-07-20',
        preview: 'https://via.placeholder.com/400x250?text=Blood+Report',
    },
];

const RecentReports: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredReports, setFilteredReports] = useState(allReports);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        setFilteredReports(
            allReports.filter((r) => r.patient.toLowerCase().includes(lower))
        );
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <DoctorNavBar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-900 mb-2">📄 Recent Reports</h1>
                    <p className="text-gray-600 mb-4">Here are the latest diagnostic reports submitted by patients.</p>

                    {/* Search Bar */}
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search by patient name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>

                {filteredReports.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/doctor/reports/${report.id}`)}
                                className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={report.preview}
                                    alt="Report Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5 space-y-2">
                                    <div className="flex items-center text-blue-800 font-semibold text-lg">
                                        <User className="w-4 h-4 mr-2 text-blue-600" />
                                        {report.patient}
                                    </div>

                                    <div className="text-gray-700 flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                        Diagnosis: <span className="ml-1 font-medium">{report.diagnosis}</span>
                                    </div>

                                    <div className="text-gray-600 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Submitted: {report.date}
                                    </div>

                                    <div className="flex items-center justify-end pt-2 text-blue-600 font-medium">
                                        View Report <ChevronRight className="w-4 h-4 ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 mt-16 text-lg">No reports found.</div>
                )}
            </div>
        </div>
    );
};

export default RecentReports;