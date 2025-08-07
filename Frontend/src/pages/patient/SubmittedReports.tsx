// import React, { useEffect, useState } from "react";
// import { FileText, CheckCircle, Clock } from "lucide-react";
// import PatientNavBar from "../../components/PatientNavBar.tsx";
// import { useNavigate } from "react-router-dom";

// const statusStyles = {
//     Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
//     Received: "bg-green-100 text-green-800 border-green-300",
//     "In Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
// };

// export default function SubmittedReports() {
//     const navigate = useNavigate();
//     const [reports, setReports] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const token = localStorage.getItem('token');

//         fetch("http://localhost:8020/reports/list", {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         })
//             .then(res => {
//                 if (!res.ok) throw new Error('Failed to fetch reports');
//                 return res.json();
//             })
//             .then(data => {
//                 const enrichedReports = data.map((report: any) => ({
//                     ...report,
//                     diagnosis: report.diagnosis || "No diagnosis available",
//                     diagnosisSummary: report.diagnosisSummary ,
//                     diagnosisUrl: report.diagnosisUrl || "No URL available"
//                 }));
//                 setReports(enrichedReports);
//                 setLoading(false);
//             })
//             .catch(err => {
//                 console.error(err);
//                 setError('Could not load reports.');
//                 setLoading(false);
//             });
//     }, []);


//     return (
//         <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
//             <PatientNavBar />
//             <div className="container mx-auto px-4 py-10 max-w-6xl">
//                 {/* Page Heading */}
//                 <div className="mb-10">
//                     <h1 className="text-3xl font-bold text-blue-900 mb-2">Your Submitted Reports</h1>
//                     <div className="h-1 w-16 bg-blue-200 rounded mb-2" />
//                     <p className="text-gray-600">All your uploaded medical reports are listed below. Click "View" to inspect details.</p>
//                 </div>
//                 {loading ? (
//                     <div className="text-center text-gray-500">Loading reports...</div>
//                 ) : error ? (
//                     <div className="text-center text-red-500">{error}</div>
//                 ) : (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                         {reports.map((report: any) => (
//                             <div
//                                 key={report.id}
//                                 className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col overflow-hidden"
//                             >
//                                 <div className="relative h-40 bg-blue-50 flex items-center justify-center overflow-hidden"> {/* Added overflow-hidden here */}
//                                     <img
//                                         src={report.fileUrl || "https://images.unsplash.com/photo-1581595219318-4d9ba8e4b69d?auto=format&fit=crop&w=400&q=80"}
//                                         alt={report.disease}
//                                         className="object-cover h-full w-full rounded-t-2xl" // Changed object-contain to object-cover
//                                     />
//                                     <div className="absolute top-2 left-2">
//                                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[report.status] || statusStyles.Pending}`}>
//                                             {report.status === "Received" ? (
//                                                 <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
//                                             ) : (
//                                                 <Clock className="w-4 h-4 mr-1 text-yellow-500" />
//                                             )}
//                                             {report.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                                 <div className="flex-1 flex flex-col p-5">
//                                     <div className="flex items-center mb-2">
//                                         <FileText className="w-5 h-5 text-blue-400 mr-2" />
//                                         <span className="text-lg font-semibold text-blue-900">{report.disease || report.fileName}</span>
//                                     </div>
//                                     <div className="text-sm text-gray-500 mb-4">Submitted on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}</div>
//                                     <div className="mt-auto flex justify-end">
//                                         <button
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
//                                             onClick={() => navigate(`/patient/report-uploaded/${report.id}`, { 
//                                                 state: { 
//                                                     report, 
//                                                     diagnosisSummary: report.diagnosisSummary
//                                                         ? report.diagnosisSummary.split(/\.(?!\d)/).map(sentence => sentence.trim()).filter(Boolean)
//                                                         : []
//                                                 } 
//                                             })}
//                                         >
//                                             View
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, Search, Filter, X } from "lucide-react";
import PatientNavBar from "../../components/PatientNavBar.tsx";
import PatientLoadingPage from "../../components/PatientLoadingPage.tsx";
import { useNavigate } from "react-router-dom";

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Received: "bg-green-100 text-green-800 border-green-300",
    "In Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
    Completed: "bg-green-100 text-green-800 border-green-300",
};

export default function SubmittedReports() {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter and search states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [diseaseFilter, setDiseaseFilter] = useState("All");
    const [filteredReports, setFilteredReports] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch("http://localhost:8020/reports/list", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch reports');
                return res.json();
            })
            .then(data => {
                const enrichedReports = data.map((report: any) => ({
                    ...report,
                    diagnosis: report.diagnosis || "No diagnosis available",
                    diagnosisSummary: report.diagnosisSummary,
                    diagnosisUrl: report.diagnosisUrl || "No URL available"
                }));
                setReports(enrichedReports);
                setFilteredReports(enrichedReports);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Could not load reports.');
                setLoading(false);
            });
    }, []);

    // Filter reports based on search term, status, and disease
    useEffect(() => {
        let filtered = reports;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter((report: any) =>
                (report.disease && report.disease.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (report.fileName && report.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (report.diagnosis && report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply status filter
        if (statusFilter !== "All") {
            filtered = filtered.filter((report: any) => report.status === statusFilter);
        }

        // Apply disease filter
        if (diseaseFilter !== "All") {
            filtered = filtered.filter((report: any) => report.disease === diseaseFilter);
        }

        setFilteredReports(filtered);
    }, [reports, searchTerm, statusFilter, diseaseFilter]);

    // Get unique diseases for filter dropdown
    const uniqueDiseases = [...new Set(reports.map((report: any) => report.disease).filter(Boolean))];
    
    // Get unique statuses for filter dropdown
    const uniqueStatuses = [...new Set(reports.map((report: any) => report.status).filter(Boolean))];

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("All");
        setDiseaseFilter("All");
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <PatientNavBar />
            <div className="container mx-auto px-4 py-10 max-w-6xl pt-20"> {/* Added pt-20 to prevent overlap */}
                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Your Submitted Reports</h1>
                    <div className="h-1 w-16 bg-blue-200 rounded mb-2" />
                    <p className="text-gray-600">All your uploaded medical reports are listed below. Click "View" to inspect details.</p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* Search Box */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search reports by disease, filename, or diagnosis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 items-center">
                            {/* Status Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="All">All Status</option>
                                    {uniqueStatuses.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Disease Filter */}
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <select
                                    value={diseaseFilter}
                                    onChange={(e) => setDiseaseFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                >
                                    <option value="All">All Diseases</option>
                                    {uniqueDiseases.map((disease) => (
                                        <option key={disease} value={disease}>
                                            {disease}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters Button */}
                            {(searchTerm || statusFilter !== "All" || diseaseFilter !== "All") && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Showing {filteredReports.length} of {reports.length} reports
                            {(searchTerm || statusFilter !== "All" || diseaseFilter !== "All") && (
                                <span className="ml-2 text-blue-600">
                                    (filtered)
                                </span>
                            )}
                        </p>
                    </div>
                </div>
                {loading ? (
                    <div className="mt-8">
                        <PatientLoadingPage 
                            message="Loading Reports" 
                            subtitle="Fetching your submitted medical reports and analysis results..."
                            showNavbar={false}
                        />
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : filteredReports.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No reports found</h3>
                        <p className="text-gray-500">
                            {searchTerm || statusFilter !== "All" || diseaseFilter !== "All" 
                                ? "Try adjusting your search or filter criteria."
                                : "You haven't uploaded any reports yet."}
                        </p>
                        {(searchTerm || statusFilter !== "All" || diseaseFilter !== "All") && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filteredReports.map((report: any) => (
                            <div
                                key={report.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col overflow-hidden"
                            >
                                <div className="relative h-40 bg-blue-50 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={report.fileUrl || "https://images.unsplash.com/photo-1581595219318-4d9ba8e4b69d?auto=format&fit=crop&w=400&q=80"}
                                        alt={report.disease}
                                        className="object-cover h-full w-full rounded-t-2xl"
                                    />
                                    <div className="absolute top-2 left-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[report.status] || statusStyles.Pending}`}>
                                            {report.status === "Received" || report.status === "Completed" ? (
                                                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                                            ) : (
                                                <Clock className="w-4 h-4 mr-1 text-yellow-500" />
                                            )}
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col p-5">
                                    <div className="flex items-center mb-2">
                                        <FileText className="w-5 h-5 text-blue-400 mr-2" />
                                        <span className="text-lg font-semibold text-blue-900">{report.disease || report.fileName}</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mb-4">Submitted on: {report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Unknown'}</div>
                                    <div className="mt-auto flex justify-end">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                            onClick={() => navigate(`/patient/report-uploaded/${report.id}`, {
                                                state: {
                                                    report,
                                                    diagnosisSummary: report.diagnosisSummary
                                                        ? report.diagnosisSummary.split(/\.(?!\d)/).map(sentence => sentence.trim()).filter(Boolean)
                                                        : []
                                                }
                                            })}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}