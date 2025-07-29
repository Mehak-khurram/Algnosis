
import React, { useState, useEffect } from "react";
import { FileText, Calendar, ChevronRight, User, Search } from "lucide-react";
import DoctorNavBar from "../../components/DoctorNavBar.tsx";
import { useNavigate } from "react-router-dom";

interface Report {
    id: string;
    email: string;
    createdAt: string;
    status: string;
    disease: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    doctorID: string;
    diagnosis: string;
    diagnosisSummary: string;
    diagnosisUrl: string;
}


const RecentReports: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [filteredReports, setFilteredReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("http://localhost:8020/reports/doctor/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch reports");
                const data = await response.json();
                setReports(data);
                setFilteredReports(data);
            } catch (err) {
                setError("Could not load reports.");
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    useEffect(() => {
        const lower = searchTerm.toLowerCase();
        setFilteredReports(
            reports.filter((r) => r.email.toLowerCase().includes(lower))
        );
    }, [searchTerm, reports]);

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
                            placeholder="Search by patient email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8 text-lg text-gray-600">Loading reports...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-8">{error}</div>
                ) : filteredReports.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                onClick={() => navigate(`/doctor/notifications/${report.id}`, { state: { report } })}
                                className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden cursor-pointer group"
                            >
                                <img
                                    src={report.fileUrl || 'https://via.placeholder.com/400x250?text=No+Preview'}
                                    alt="Report Preview"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5 space-y-2">
                                    <div className="flex items-center text-blue-800 font-semibold text-lg">
                                        <User className="w-4 h-4 mr-2 text-blue-600" />
                                        {report.email}
                                    </div>

                                    <div className="text-gray-700 flex items-center">
                                        <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                        Diagnosis: <span className="ml-1 font-medium">{report.diagnosis || 'Pending'}</span>
                                    </div>

                                    <div className="text-gray-600 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Submitted: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
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