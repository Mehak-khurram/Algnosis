import React, { useEffect, useState } from "react";
import { FileText, Clock, CheckCircle, Download, Stethoscope, UserCheck, ChevronRight, Activity, HeartPulse, ClipboardCheck, Bell, Calendar, Settings, Search, MessageSquare, User, BookOpen } from "lucide-react";
import PatientNavBar from "../../components/PatientNavBar.tsx";
import { useLocation, useNavigate } from "react-router-dom";



type ReportStatus = "In Review" | "Received";
const reportStatus: ReportStatus = "In Review";

type Doctor = {
    id: string;
    assignedReports: string[];
    specialization: string;
    yearsOfExperience: number;
    qualifications: string;
    hospitalName: string;
    medicalLicenseNumber: string;
    shortBio: string;
    role: string;
    firstName?: string;
    lastName?: string;
};

export default function MedicalDiagnosisReport() {
    const location = useLocation();
    const navigate = useNavigate();
    const report = location.state?.report;
    const disease = location.state?.disease;
    const fileName = location.state?.fileName;
    const previewUrl = location.state?.previewUrl;

    React.useEffect(() => {
        if (!report) {
            navigate("/patient/reports");
        }
    }, [report, navigate]);

    // Fallbacks for static demo if no data
    const diagnosis = report?.diagnosisSummary || "No diagnosis summary available.";
    const recommendations = report?.recommendations || [
        "No recommendations available."
    ];
    const imageUrl = previewUrl || report?.fileUrl || report?.cloudinaryUrl || report?.imageUrl || "https://images.unsplash.com/photo-1581595219318-4d9ba8e4b69d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";
    const createdAtDisplay = report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Unknown date";
    const fileTypeDisplay = report?.fileType || "Unknown type";

    const [animatedStep, setAnimatedStep] = React.useState(0);
    const createdAt = report?.createdAt;
    const diagnosisSummary = report?.diagnosisSummary;
    const diagnosisUrl = report?.diagnosisUrl;
    const doctorID = report?.doctorID;
    const email = report?.email;
    const fileType = report?.fileType;
    const fileUrl = report?.fileUrl;
    const id = report?.id;
    const status = report?.status;

    // Timeline step dates
    const uploadedDate = report?.createdAt ? new Date(report.createdAt).toLocaleString() : "Unknown";
    const resultsDate = (report?.completedAt || report?.reviewedAt)
        ? new Date(report.completedAt || report.reviewedAt).toLocaleString()
        : (status === "Received" ? "Completed" : "Pending");

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [doctorLoading, setDoctorLoading] = useState(false);
    const [doctorError, setDoctorError] = useState<string | null>(null);

    useEffect(() => {
        if (report?.doctorID) {
            setDoctorLoading(true);
            const token = localStorage.getItem('token');
            fetch(`http://localhost:11000/doctor/get/${report.doctorID}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            })
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch doctor');
                    return res.json();
                })
                .then(data => {
                    setDoctor(data);
                    setDoctorLoading(false);
                })
                .catch(err => {
                    setDoctorError('Could not load doctor information.');
                    setDoctorLoading(false);
                });
        }
    }, [report?.doctorID]);


    // Animate timeline progress
    React.useEffect(() => {
        if (status === "Received") {
            let step = 0;
            const interval = setInterval(() => {
                step++;
                setAnimatedStep(step);
                if (step >= 3) clearInterval(interval);
            }, 600);
            return () => clearInterval(interval);
        } else {
            setAnimatedStep(1);
        }
    }, [status]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Navigation */}
            <PatientNavBar />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Breadcrumb and Header */}
                <div className="mb-8">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="hover:text-blue-600 cursor-pointer flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" /> Dashboard
                        </span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="hover:text-blue-600 cursor-pointer">Medical Reports</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-blue-600 font-medium">Chest X-ray Report</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Medical Diagnosis Report</h1>
                            <p className="text-gray-600 mt-2">Chest X-ray examination results and diagnosis</p>
                        </div>
                        <div className="flex space-x-3">

                            <button className="flex items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:opacity-90 transition-opacity">
                                <Download className="w-5 h-5 mr-2" />
                                <span>Download PDF</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Report Image */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <FileText className="w-5 h-5 mr-3 text-blue-600" />
                                    Chest X-ray Image
                                </h2>
                                <div className="flex items-center text-sm">
                                    <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                                    <span className="text-gray-600">Uploaded: {createdAtDisplay}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img
                                        src={imageUrl}
                                        alt={fileName || "Chest X-ray"}
                                        className="object-contain w-full h-full"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
                                            Chest X-ray - Anterior View
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-4 text-sm text-gray-600">
                                    <div className="flex items-center">
                                        <span className="font-medium">File Size:</span>
                                        <span className="ml-2">4.2 MB</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">Dimensions:</span>
                                        <span className="ml-2">2048×1536</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="font-medium">Format:</span>
                                        <span className="ml-2">{fileTypeDisplay}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Status & Timeline */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <Clock className="w-5 h-5 mr-3 text-blue-600" />
                                    Report Status
                                </h2>
                            </div>
                            <div className="flex-1 flex flex-col justify-between p-6">
                                <div className={`flex flex-col items-center justify-center py-4 rounded-xl ${status === "Received" ? "bg-green-50" : "bg-yellow-50"}`}>
                                    {status === "Received" ? (
                                        <CheckCircle className="w-12 h-12 text-green-500 mb-4 animate-bounce" />
                                    ) : (
                                        <Clock className="w-12 h-12 text-yellow-500 mb-4 animate-pulse" />
                                    )}
                                    <div className={`text-xl font-bold ${status === "Received" ? "text-green-700" : "text-yellow-700"}`}>{status}</div>
                                    <p className="text-gray-600 mt-2 text-center max-w-xs">
                                        {status === "Received"
                                            ? "Your report has been finalized"
                                            : "Report is being reviewed by our specialists"}
                                    </p>
                                </div>

                                {/* Timeline - Animated Vertical Progress */}
                                <div className="mt-6 flex-1 flex flex-col justify-center">
                                    <h3 className="font-medium text-gray-800 mb-3">Timeline</h3>
                                    <div className="relative flex flex-col items-center h-56 w-full">
                                        {/* Vertical bar */}
                                        <div className="absolute left-1/2 -translate-x-1/2 top-6 bottom-6 w-2 bg-gray-200 rounded-full z-0" />
                                        {/* Steps */}
                                        {[
                                            { label: "Report Uploaded", date: uploadedDate },
                                            { label: "Results Available", date: resultsDate },
                                        ].map((step, idx) => {
                                            const isActive = idx < animatedStep;
                                            const isCurrent = idx === animatedStep - 1;
                                            return (
                                                <div key={idx} className="relative z-10 flex items-center w-full mb-8 last:mb-0" style={{ minHeight: 48 }}>
                                                    <div className={`flex flex-col items-center mr-4`}>
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? "bg-blue-600 border-blue-400" : "bg-gray-300 border-gray-200"} ${isCurrent ? "animate-pulse" : ""}`}>
                                                            {isActive ? <CheckCircle className="w-4 h-4 text-white" /> : <Clock className="w-4 h-4 text-gray-400" />}
                                                        </div>
                                                        {idx < 2 && <div className={`w-1 h-8 ${isActive ? "bg-blue-400" : "bg-gray-200"} transition-all duration-500`} />}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium text-gray-800 text-base ${isActive ? "" : "text-gray-400"}`}>{step.label}</p>
                                                        <p className={`text-xs ${isActive ? "text-gray-500" : "text-gray-300"}`}>{step.date}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Left Column - Diagnosis (below image) */}
                    <div className="lg:col-span-2">
                        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full transition-all duration-500 ${status !== "Received" ? "opacity-60 grayscale" : "opacity-100"}`}>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <HeartPulse className="w-5 h-5 mr-3 text-blue-600" />
                                    Diagnosis Summary
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                        {status === "Received"
                                            ? diagnosis
                                            : "Please wait for the diagnosis summary to be available."}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                                        <ClipboardCheck className="w-4 h-4 mr-2 text-blue-600" />
                                        Recommendations
                                    </h3>
                                    <ul className="space-y-3">
                                        {status === "Received"
                                            ? recommendations.map((item, index) => (
                                                <li key={index} className="flex items-start bg-blue-50 rounded-lg p-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-600 mr-3"></div>
                                                    <span className="text-gray-700">{item}</span>
                                                </li>
                                            ))
                                            : [
                                                "Recommendations will appear here once the report is complete.",
                                                "Please wait for the review to finish."
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start bg-blue-50 rounded-lg p-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-gray-400 mr-3"></div>
                                                    <span className="text-gray-400">{item}</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Doctor */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                                    <Stethoscope className="w-5 h-5 mr-3 text-blue-600" />
                                    Reviewing Physician
                                </h2>
                            </div>
                            <div className="p-6">
                                {doctorLoading ? (
                                    <div className="text-gray-500 text-center">Loading doctor information...</div>
                                ) : doctorError ? (
                                    <div className="text-red-500 text-center">{doctorError}</div>
                                ) : doctor ? (
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold mb-4 overflow-hidden border-4 border-white shadow-lg">
                                            <User className="w-16 h-16" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">{doctor.firstName + " " + doctor.lastName || doctor.id}</h3>
                                        <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                {doctor.qualifications}
                                            </span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                                {doctor.yearsOfExperience}+ years experience
                                            </span>
                                        </div>
                                        <div className="mt-6 w-full bg-gray-50 rounded-xl p-4">
                                            <h4 className="font-medium text-gray-800 mb-2">About</h4>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-700">{doctor.shortBio}</p>
                                                <p className="text-gray-700">Hospital: {doctor.hospitalName}</p>
                                                <p className="text-gray-700">License: {doctor.medicalLicenseNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-center">No doctor information available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Actions */}

            </div>

            {/* Footer */}

        </div>
    );
}