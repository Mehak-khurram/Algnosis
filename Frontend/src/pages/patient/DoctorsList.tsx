import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import PatientLoadingPage from '../../components/PatientLoadingPage.tsx';
import {
    User,
    Heart,
    Stethoscope,
    Smile,
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
    Users,
} from "lucide-react";

// Card, Button, Badge components
const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardDescription = ({ children, className }: any) => <div className={className}>{children}</div>;
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

const DoctorsList: React.FC = () => {
    const navigate = useNavigate();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch assigned doctors from API
    useEffect(() => {
        const fetchAssignedDoctors = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found. Please login again.');
                }

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
                        throw new Error(`Failed to fetch assigned doctors: ${response.statusText}`);
                    }
                }

                const assignedDoctors = await response.json();
                console.log('Fetched assigned doctors:', assignedDoctors);
                setDoctors(assignedDoctors);
            } catch (err) {
                console.error('Error fetching assigned doctors:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedDoctors();
    }, []);

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

    if (loading) {
        return (
            <PatientLoadingPage 
                message="Loading Your Doctors" 
                subtitle="Fetching information about your assigned healthcare providers..."
            />
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
                <PatientNavBar />
                <div className="flex-1 flex items-center justify-center pt-16">
                    <div className="text-center max-w-md mx-auto p-8">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Doctors</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
                <PatientNavBar />
                <div className="flex-1 flex items-center justify-center pt-16">
                    <div className="text-center max-w-md mx-auto p-8">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Doctors Assigned Yet</h2>
                        <p className="text-gray-600 mb-6">
                            You don't have any doctors assigned to your medical reports yet. 
                            Upload a medical report to get connected with healthcare professionals.
                        </p>
                        <Button 
                            onClick={() => window.location.href = '/patient/dashboard'}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
            <PatientNavBar />
            <div className="flex-1 w-full max-w-7xl mx-auto p-8 pt-24">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Assigned Doctors</h1>
                            <p className="text-gray-600">Healthcare professionals managing your medical reports</p>
                        </div>
                    </div>
                    
                    {/* Stats Summary */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <CheckCircle className="w-8 h-8 text-blue-200 mr-3" />
                                <div>
                                    <h3 className="text-xl font-semibold">
                                        {doctors.length} Doctor{doctors.length !== 1 ? 's' : ''} Assigned
                                    </h3>
                                    <p className="text-blue-100">
                                        {new Set(doctors.map(d => d.specialization)).size} Specialization{new Set(doctors.map(d => d.specialization)).size !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {Math.round(doctors.reduce((sum, doc) => sum + doc.yearsOfExperience, 0) / doctors.length)}
                                </div>
                                <div className="text-blue-100 text-sm">Avg. Experience (years)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map((doctor, idx) => {
                        const SpecIcon = getSpecializationIcon(doctor.specialization);
                        const colorClass = getSpecializationColor(doctor.specialization);
                        
                        return (
                            <Card
                                key={doctor.id}
                                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-white hover:scale-[1.02] cursor-pointer animate-fadein-tile"
                                style={{ animationDelay: `${idx * 100}ms` }}
                                onClick={() => navigate(`/patient/doctor/${doctor.id}`, { state: { doctor } })}
                            >
                                <CardContent className="p-6">
                                    {/* Doctor Header */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white flex-shrink-0`}>
                                            <SpecIcon className="w-7 h-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </h3>
                                            <Badge className="bg-blue-100 text-blue-700 text-sm mt-1">
                                                {doctor.specialization}
                                            </Badge>
                                        </div>
                                    </div>

                                    {/* Doctor Info */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm">{doctor.yearsOfExperience} years experience</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Building className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span className="text-sm truncate">{doctor.hospitalName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
                                            <span className="text-sm truncate">{doctor.qualifications}</span>
                                        </div>
                                        {doctor.assignedReports && doctor.assignedReports.length > 0 && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                                <span className="text-sm">{doctor.assignedReports.length} report{doctor.assignedReports.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Button */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <Button 
                                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                navigate(`/patient/doctor/${doctor.id}`, { state: { doctor } });
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
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
                @keyframes fadeinTile {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadein-tile {
                    animation: fadeinTile 0.6s cubic-bezier(.4,0,.2,1) both;
                }
            `}</style>
        </div>
    );
}

export default DoctorsList; 