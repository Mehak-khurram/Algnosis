
// import React, { useState, useEffect } from "react";
// import { FileText, Calendar, ChevronRight, User, Search } from "lucide-react";
// import DoctorNavBar from "../../components/DoctorNavBar.tsx";
// import { useNavigate } from "react-router-dom";

// interface Report {
//     id: string;
//     email: string;
//     createdAt: string;
//     status: string;
//     disease: string;
//     fileUrl: string;
//     fileName: string;
//     fileType: string;
//     doctorID: string;
//     diagnosis: string;
//     diagnosisSummary: string;
//     diagnosisUrl: string;
// }


// const RecentReports: React.FC = () => {
//     const navigate = useNavigate();
//     const [searchTerm, setSearchTerm] = useState("");
//     const [reports, setReports] = useState<Report[]>([]);
//     const [filteredReports, setFilteredReports] = useState<Report[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchReports = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const token = localStorage.getItem('token');
//                 const response = await fetch("http://localhost:8020/reports/doctor/list", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 if (!response.ok) throw new Error("Failed to fetch reports");
//                 const data = await response.json();
//                 setReports(data);
//                 setFilteredReports(data);
//             } catch (err) {
//                 setError("Could not load reports.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchReports();
//     }, []);

//     useEffect(() => {
//         const lower = searchTerm.toLowerCase();
//         setFilteredReports(
//             reports.filter((r) => r.email.toLowerCase().includes(lower))
//         );
//     }, [searchTerm, reports]);

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//             <DoctorNavBar />

//             <div className="max-w-7xl mx-auto px-6 py-10">
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-extrabold text-blue-900 mb-2">📄 Recent Reports</h1>
//                     <p className="text-gray-600 mb-4">Here are the latest diagnostic reports submitted by patients.</p>

//                     {/* Search Bar */}
//                     <div className="relative w-full sm:w-96">
//                         <input
//                             type="text"
//                             placeholder="Search by patient email..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         />
//                         <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
//                     </div>
//                 </div>

//                 {loading ? (
//                     <div className="text-center py-8 text-lg text-gray-600">Loading reports...</div>
//                 ) : error ? (
//                     <div className="text-red-500 text-center py-8">{error}</div>
//                 ) : filteredReports.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                         {filteredReports.map((report) => (
//                             <div
//                                 key={report.id}
//                                 onClick={() => navigate(`/doctor/notifications/${report.id}`, { state: { report } })}
//                                 className="bg-white shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl overflow-hidden cursor-pointer group"
//                             >
//                                 <img
//                                     src={report.fileUrl || 'https://via.placeholder.com/400x250?text=No+Preview'}
//                                     alt="Report Preview"
//                                     className="w-full h-48 object-cover"
//                                 />
//                                 <div className="p-5 space-y-2">
//                                     <div className="flex items-center text-blue-800 font-semibold text-lg">
//                                         <User className="w-4 h-4 mr-2 text-blue-600" />
//                                         {report.email}
//                                     </div>

//                                     <div className="text-gray-700 flex items-center">
//                                         <FileText className="w-4 h-4 mr-2 text-blue-600" />
//                                         Diagnosis: <span className="ml-1 font-medium">{report.diagnosis || 'Pending'}</span>
//                                     </div>

//                                     <div className="text-gray-600 flex items-center">
//                                         <Calendar className="w-4 h-4 mr-2 text-blue-600" />
//                                         Submitted: {report.createdAt ? new Date(report.createdAt).toLocaleString() : 'N/A'}
//                                     </div>

//                                     <div className="flex items-center justify-end pt-2 text-blue-600 font-medium">
//                                         View Report <ChevronRight className="w-4 h-4 ml-1" />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center text-gray-500 mt-16 text-lg">No reports found.</div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RecentReports;


import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  ChevronRight,
  User,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
} from "lucide-react";
import DoctorNavBar from "../../components/DoctorNavBar.tsx";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

// Defines the shape of a single report object.
interface Report {
  id: string;
  email: string;
  createdAt: string;
  status: string; // 'pending', 'diagnosed', 'rejected'
  disease: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  doctorID: string;
  diagnosis: string;
  diagnosisSummary: string;
  diagnosisUrl: string;
}

// Defines the shape of the filters state.
interface Filters {
  status: string;
  disease: string;
}

const RecentReports: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for handling filters
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    disease: "all",
  });

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8020/reports/doctor/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch reports");
        const data = await response.json();
        setReports(data);
        setFilteredReports(data); // Initial sync
      } catch (err) {
        setError("Could not load reports.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Effect to handle both search and filters
  useEffect(() => {
    let tempReports = reports;

    // Debug: Log all unique statuses to understand what values exist
    const uniqueStatuses = [...new Set(reports.map(r => r.status))];
    console.log('All unique statuses in reports:', uniqueStatuses);
    console.log('Current filter status:', filters.status);

    // Apply search filter first
    const lower = searchTerm.toLowerCase();
    if (lower) {
      tempReports = tempReports.filter((r) => r.email.toLowerCase().includes(lower));
    }

    // Apply status filter (case-insensitive)
    if (filters.status !== "all") {
      const beforeFilter = tempReports.length;
      tempReports = tempReports.filter((r) => r.status.toLowerCase() === filters.status.toLowerCase());
      console.log(`Status filter: ${beforeFilter} -> ${tempReports.length} reports`);
    }

    // Apply disease filter
    if (filters.disease !== "all") {
      tempReports = tempReports.filter((r) => r.disease.toLowerCase() === filters.disease.toLowerCase());
    }

    console.log('Final filtered reports:', tempReports.length);
    setFilteredReports(tempReports);
  }, [searchTerm, filters, reports]);

    const renderStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };
  // Extract unique disease types for the filter dropdown
  const uniqueDiseases = Array.from(new Set(reports.map((r) => r.disease.toLowerCase()))).filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <DoctorNavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Recent Reports</h1>
          <p className="mt-2 text-lg text-gray-600">
            A comprehensive view of patient reports, with advanced filtering options.
          </p>
        </header>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              placeholder="Search by patient email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-12 pr-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Filters */}
          <div className="flex gap-4 w-full md:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <label htmlFor="status-filter" className="sr-only">
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="block w-full py-2.5 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                {/*<option value="diagnosed">Diagnosed</option>*/}
                <option value="completed">Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter className="h-5 w-5" />
              </div>
            </div>

            {/* Disease Filter */}
            {/* <div className="relative">
              <label htmlFor="disease-filter" className="sr-only">
                Filter by Disease
              </label>
              <select
                id="disease-filter"
                value={filters.disease}
                onChange={(e) => setFilters({ ...filters, disease: e.target.value })}
                className="block w-full py-2.5 pl-4 pr-10 text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="all">All Diseases</option>
                {uniqueDiseases.map((disease) => (
                  <option key={disease} value={disease}>
                    {disease.charAt(0).toUpperCase() + disease.slice(1)}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter className="h-5 w-5" />
              </div>
            </div> */}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-16 text-xl text-gray-500">Loading reports...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-16 text-lg">{error}</div>
        ) : filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => navigate(`/doctor/notifications/${report.id}`, { state: { report } })}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer group"
              >
                {/* Image or Placeholder */}
                <div className="relative">
                  <img
                    src={report.fileUrl || "https://via.placeholder.com/600x400?text=No+Preview"}
                    alt="Report Preview"
                    className="w-full h-52 object-cover"
                  />
                  {/* Status Tag */}
                  <div
                    className={clsx(
                      "absolute top-4 right-4 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg",
                      {
                        "bg-green-500": report.status.toLowerCase() === "completed",
                        "bg-yellow-500": report.status.toLowerCase() === "pending",
                        "bg-gray-500": report.status.toLowerCase() !== "completed" && report.status.toLowerCase() !== "pending",
                      }
                    )}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </div>
                </div>

                {/* Report Details */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-900 font-semibold text-xl">
                      {/* <User className="w-5 h-5 mr-2 text-blue-600" />
                      {report.email} */}
                      {renderStatusIcon(report.status)}
                      <br></br>
                      <span className="ml-2">{report.status}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-gray-800">Diagnosis:</span>
                    <span className="ml-2">{report.diagnosis || "Pending"}</span>
                  </p>

                  <p className="text-gray-600 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-gray-800">Submitted:</span>
                    <span className="ml-2">
                      {report.createdAt ? new Date(report.createdAt).toLocaleString() : "N/A"}
                    </span>
                  </p>

                  <div className="pt-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      Report ID: <span className="font-mono text-gray-700">{report.id.substring(0, 8)}...</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-800 transition-colors">
                      View Details <ChevronRight className="w-5 h-5 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-16 text-xl">No reports found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default RecentReports;