import React from "react";
import { FileText, CheckCircle, Clock } from "lucide-react";
import PatientNavBar from "../../components/PatientNavBar.tsx";
import { useNavigate } from "react-router-dom";

// Example data (replace with real data from backend/API)
const reports = [
    {
        id: 1,
        title: "Pneumonia",
        date: "2025-07-21",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1581595219318-4d9ba8e4b69d?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 2,
        title: "Normal Chest X-ray",
        date: "2025-07-18",
        status: "Received",
        image: "https://images.unsplash.com/photo-1511174511562-5f97f2b2e2b9?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 3,
        title: "Anemia Blood Report",
        date: "2025-07-10",
        status: "Received",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: 4,
        title: "TB Screening",
        date: "2025-07-05",
        status: "Pending",
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    },
];

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Received: "bg-green-100 text-green-800 border-green-300",
};

export default function SubmittedReports() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-blue-50">
            <PatientNavBar />
            <div className="container mx-auto px-4 py-10 max-w-6xl">
                {/* Page Heading */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Your Submitted Reports</h1>
                    <div className="h-1 w-16 bg-blue-200 rounded mb-2" />
                    <p className="text-gray-600">All your uploaded medical reports are listed below. Click "View" to inspect details.</p>
                </div>
                {/* Reports Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col overflow-hidden"
                        >
                            <div className="relative h-40 bg-blue-50 flex items-center justify-center">
                                <img
                                    src={report.image}
                                    alt={report.title}
                                    className="object-contain h-full w-full rounded-t-2xl"
                                />
                                <div className="absolute top-2 left-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles[report.status]}`}>
                                        {report.status === "Received" ? (
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
                                    <span className="text-lg font-semibold text-blue-900">{report.title}</span>
                                </div>
                                <div className="text-sm text-gray-500 mb-4">Submitted on: {new Date(report.date).toLocaleDateString()}</div>
                                <div className="mt-auto flex justify-end">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                                        onClick={() => navigate(`/patient/report-uploaded?id=${report.id}`)}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 