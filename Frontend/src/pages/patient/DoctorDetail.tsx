import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import PatientLoadingPage from '../../components/PatientLoadingPage.tsx';
import {
    User,
    Heart,
    Stethoscope,
    Star,
    Phone,
    Mail,
    Activity,
    Calendar,
    FileText,
    Clock,
    Building,
    Award,
    Shield,
    AlertCircle,
    CheckCircle,
    Loader2,
    ArrowLeft,
    MapPin,
    Briefcase,
    GraduationCap,
    Users,
} from "lucide-react";

// Card, Button, Badge components
const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const Button = ({ children, className, ...props }: any) => <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ''}`} {...props}>{children}</button>;
const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;

// Interface for Doctor data from API
interface Doctor {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    specialization: string;
    yearsOfExperience: number;
    qualifications: string;
    hospitalName: string;
    medicalLicenseNumber: string;
    shortBio: string;
    assignedReports?: string[];
    role: string;
}

const DoctorDetail: React.FC = () => {
    const { doctorId } = useParams<{ doctorId: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [doctor, setDoctor] = useState<Doctor | null>(location.state?.doctor || null);
    const [loading, setLoading] = useState(!doctor);
    const [error, setError] = useState<string | null>(null);

    // Get specialization icon
    const getSpecializationIcon = (specialization: string) => {
        const spec = specialization.toLowerCase();
        if (spec.includes('cardio') || spec.includes('heart')) return Heart;
        if (spec.includes('neuro') || spec.includes('brain')) return Activity;
        if (spec.includes('pulmo') || spec.includes('lung')) return Activity;
        if (spec.includes('general')) return User;
        return Stethoscope;
    };

    // Get specialization color
    const getSpecializationColor = (specialization: string) => {
        const spec = specialization.toLowerCase();
        if (spec.includes('cardio') || spec.includes('heart')) return 'from-red-400 to-red-600';
        if (spec.includes('neuro') || spec.includes('brain')) return 'from-purple-400 to-purple-600';
        if (spec.includes('pulmo') || spec.includes('lung')) return 'from-green-400 to-green-600';
        if (spec.includes('general')) return 'from-blue-400 to-blue-600';
        return 'from-indigo-400 to-indigo-600';
    };

    // Fetch doctor details if not passed via state
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            if (doctor) return; // Already have doctor data

            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found. Please login again.');
                }

                // First get all assigned doctors, then find the specific one
                const response = await fetch('http://localhost:17000/patient/assigned-doctors', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Authentication failed. Please login again.');
                    } else if (response.status === 403) {
                        throw new Error('Access denied. Patient role required.');
                    } else {
                        throw new Error(`Failed to fetch doctor details: ${response.statusText}`);
                    }
                }

                const assignedDoctors = await response.json();
                const foundDoctor = assignedDoctors.find((doc: Doctor) => doc.id === doctorId);
                
                if (!foundDoctor) {
                    throw new Error('Doctor not found or not assigned to you.');
                }

                setDoctor(foundDoctor);
            } catch (err) {
                console.error('Error fetching doctor details:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetails();
    }, [doctorId, doctor]);

    if (loading) {
        return (
            <PatientLoadingPage 
                message="Loading Doctor Details" 
                subtitle="Fetching comprehensive doctor information and professional background..."
            />
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
                <PatientNavBar />
                <div className="flex-1 flex items-center justify-center pt-16">
                    <div className="text-center max-w-md mx-auto p-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The requested doctor could not be found.'}</p>
                        <div className="flex gap-3 justify-center">
                            <Button 
                                onClick={() => navigate('/patient/doctors')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                            >
                                Back to Doctors
                            </Button>
                            <Button 
                                onClick={() => window.location.reload()}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const SpecIcon = getSpecializationIcon(doctor.specialization);
    const colorClass = getSpecializationColor(doctor.specialization);

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
            <PatientNavBar />
            <div className="flex-1 w-full max-w-6xl mx-auto p-8 pt-24">
                {/* Back Button */}
                <Button
                    onClick={() => navigate('/patient/doctors')}
                    className="flex items-center gap-2 mb-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Doctors
                </Button>

                {/* Doctor Header Card */}
                <Card className={`mb-8 overflow-hidden border-0 shadow-xl`}>
                    <div className={`bg-gradient-to-r ${colorClass} p-8 text-white`}>
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                <SpecIcon className="w-12 h-12" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold">Dr. {doctor.firstName} {doctor.lastName}</h1>
                                    <Star className="w-8 h-8 text-yellow-300 fill-current" />
                                </div>
                                <Badge className="bg-white/20 text-white text-lg px-4 py-2 mb-4">
                                    {doctor.specialization}
                                </Badge>
                                <div className="flex items-center gap-6 text-white/90">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span>{doctor.yearsOfExperience} years experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        <span>{doctor.hospitalName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Main Content Grid */}
                <div className="space-y-8">
                    {/* First Row - Professional Information and Contact Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Professional Information - Takes 2/3 width to match second row */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-lg h-full">
                                <CardHeader className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Briefcase className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <GraduationCap className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Qualifications</h4>
                                                    <p className="text-gray-700 mt-1">{doctor.qualifications}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Experience</h4>
                                                    <p className="text-gray-700 mt-1">{doctor.yearsOfExperience} years in {doctor.specialization}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Building className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Hospital/Clinic</h4>
                                                    <p className="text-gray-700 mt-1">{doctor.hospitalName}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Shield className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Medical License</h4>
                                                    <p className="text-gray-700 mt-1">{doctor.medicalLicenseNumber}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information - Takes 1/3 width */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-lg h-full">
                                <CardHeader className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-6 h-6 text-blue-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                        <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Phone</h4>
                                            <p className="text-gray-600">{doctor.phoneNumber}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                                        <Mail className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">Email</h4>
                                            <p className="text-gray-600 break-all">{doctor.email}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Second Row - About & Reports in Left Column, Upload Report in Right Column */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - About and Medical Reports */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            {doctor.shortBio && (
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="p-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <User className="w-6 h-6 text-green-600" />
                                            <h2 className="text-2xl font-bold text-gray-900">About Dr. {doctor.lastName}</h2>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <p className="text-gray-700 leading-relaxed text-lg">{doctor.shortBio}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reports Information */}
                            {doctor.assignedReports && doctor.assignedReports.length > 0 && (
                                <Card className="border-0 shadow-lg">
                                    <CardHeader className="p-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-6 h-6 text-orange-600" />
                                            <h2 className="text-2xl font-bold text-gray-900">Your Medical Reports</h2>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-lg">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {doctor.assignedReports.length} Report{doctor.assignedReports.length !== 1 ? 's' : ''} Under Review
                                                </h4>
                                                <p className="text-gray-600">Dr. {doctor.lastName} is currently managing your medical reports</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Upload New Report */}
                        <div className="lg:col-span-1">
                            <Card className="border-0 shadow-lg h-full">
                                <CardHeader className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-green-600" />
                                        <h2 className="text-xl font-bold text-gray-900">Submit New Report</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 flex flex-col justify-center h-full">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <FileText className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">Need a New Diagnosis?</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Upload a new medical report to get a professional analysis from our qualified doctors.
                                        </p>
                                    </div>
                                    <Button 
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                        onClick={() => navigate('/patient/upload-report')}
                                    >
                                        <FileText className="w-5 h-5" />
                                        Upload Medical Report
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadein {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadein {
                    animation: fadein 0.5s cubic-bezier(.4,0,.2,1) both;
                }
            `}</style>
        </div>
    );
};

export default DoctorDetail;