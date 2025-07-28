"use client";

import { useState, useEffect, useRef } from "react";
import {
    User,
    Calendar,
    AlertTriangle,
    Heart,
    Scissors,
    Utensils,
    Pill,
    Upload,
    Phone,
    Edit,
    FileText,
    Activity,
    Shield,
    Clock,
    Smile,
    Star,
    CheckCircle,
    Hourglass,
    Mail,
    Lightbulb,
    Info,
    MessageSquare,
    Bell,
    PlusCircle,
    ChevronRight, // For navigation/more info arrows
    Dumbbell, // For exercise advice
    BookOpen, // For dietary advice
    Moon, // For sleep advice
    Droplet as Water, // For hydration advice (using Droplet icon as Water)
    Leaf, // For general wellness
    ClipboardList, // For appointments
    Stethoscope, // For doctors
} from "lucide-react";

// Assuming PatientNavBar exists and is styled appropriately for this new UI.
// If it clashes, you might need to adjust PatientNavBar.tsx or integrate its logic directly.
import PatientNavBar from '../../components/PatientNavBar.tsx';

// --- Reimagined & Enhanced Mini Components ---

const Avatar = ({ children, className }: any) => <div className={`inline-flex items-center justify-center bg-gray-200 ${className}`}>{children}</div>;
const AvatarImage = ({ src, className }: any) => <img src={src} className={className} alt="avatar" />;
const AvatarFallback = ({ children, className }: any) => <div className={className}>{children}</div>;

const Button = ({ children, className, variant = "primary", icon: Icon, ...props }: any) => {
    const baseStyle = "px-5 py-2.5 rounded-full font-semibold transition-all duration-300 flex items-center justify-center text-base whitespace-nowrap";
    const variants: { [key: string]: string } = {
        primary: "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg active:shadow-sm hover:scale-[1.02] focus:ring-blue-300",
        secondary: "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-gray-300",
        outline: "bg-transparent text-blue-600 border border-blue-300 hover:bg-blue-50 hover:border-blue-400 focus:ring-blue-300",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
    };
    return (
        <button className={`${baseStyle} ${variants[variant]} ${className || ''}`} {...props}>
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {children}
        </button>
    );
};

const Card = ({ children, className, as = "div" }: any) => {
    const Component = as;
    return <Component className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>{children}</Component>;
};
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className }: any) => <h3 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h3>;
const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${className}`}>{children}</span>;

// Custom Metric Tile Component (for vital stats, info, etc.)
interface MetricTileProps {
    icon: React.ElementType;
    title: string;
    value: string | number | JSX.Element;
    unit?: string;
    colorScheme: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'indigo' | 'yellow'; // More specific color options
    description?: string;
    className?: string;
}

const MetricTile: React.FC<MetricTileProps> = ({ icon: Icon, title, value, unit, colorScheme, description, className }) => {
    // Tailwind doesn't support dynamic color classes, so use a mapping
    const colorMap: Record<string, { from: string; to: string }> = {
        blue: { from: 'from-blue-400', to: 'to-blue-600' },
        red: { from: 'from-red-400', to: 'to-red-600' },
        green: { from: 'from-green-400', to: 'to-green-600' },
        purple: { from: 'from-purple-400', to: 'to-purple-600' },
        orange: { from: 'from-orange-400', to: 'to-orange-600' },
        indigo: { from: 'from-indigo-400', to: 'to-indigo-600' },
        yellow: { from: 'from-yellow-400', to: 'to-yellow-600' },
        teal: { from: 'from-teal-400', to: 'to-teal-600' },
    };
    const bgFrom = colorMap[colorScheme]?.from || 'from-blue-400';
    const bgTo = colorMap[colorScheme]?.to || 'to-blue-600';
    const tileBg = `bg-gradient-to-br from-white to-${colorScheme}-50/50`;
    return (
        <Card className={`p-5 flex flex-col justify-between transform transition-transform duration-200 hover:scale-[1.01] hover:shadow-xl cursor-pointer ${tileBg} ${className || ''}`}>
            <div className="flex items-center mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${bgFrom} ${bgTo} rounded-lg flex items-center justify-center mr-3 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{title}</p>
            </div>
            <div className="flex-grow">
                <div className="text-3xl font-extrabold text-gray-900 leading-tight">
                    {value}
                    {unit && <span className="text-lg font-semibold ml-1 text-gray-600">{unit}</span>}
                </div>
                {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
        </Card>
    );
};

// Utility: returns gender-based image URL (you can update these with actual image paths)
const getAvatarImage = (gender: string) => {
    if (gender.toLowerCase() === "male") return "/male-avatar.svg"; // Placeholder
    if (gender.toLowerCase() === "female") return "/female-avatar.svg"; // Placeholder
    return "/placeholder.svg"; // default fallback
};

interface EmergencyContact {
    name: string;
    phone: string;
    relationship?: string;
}

interface PatientData {
    name: string;
    age: number;
    gender: string;
    email: string;
    phoneNumber: string;
    allergies: string[];
    restrictions: string[];
    medicalDevices: string[];
    recentSurgery: string;
    currentMedications: string[];
    emergencyContacts: EmergencyContact[];
}

interface Report {
    id: string;
    status: string;
    disease: string;
    createdAt: string;
    diagnosis: string;
    // Optionally keep legacy fields for compatibility
    reportDate?: string;
}

interface HealthAdvice {
    text: string;
    icon: React.ElementType;
    color: string;
}

const healthAdvices: HealthAdvice[] = [
    { text: "Stay hydrated! Drink at least 8 glasses of water a day for better health.", icon: Water, color: "blue" },
    { text: "Aim for 30 minutes of moderate exercise most days to boost your mood and energy.", icon: Dumbbell, color: "green" },
    { text: "Prioritize sleep. Get 7-9 hours of quality sleep nightly for optimal recovery.", icon: Moon, color: "purple" },
    { text: "Eat a balanced diet rich in fruits, vegetables, and whole grains for vital nutrients.", icon: BookOpen, color: "orange" },
    { text: "Practice mindfulness or meditation daily to reduce stress and improve focus.", icon: Leaf, color: "teal" } // Teal added for diversity
];

export default function PatientDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [reportsError, setReportsError] = useState<string | null>(null);
    const [currentAdviceIndex, setCurrentAdviceIndex] = useState(0);

    // Ref to manage the auto-slider interval
    const adviceIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchPatientData = async () => {
            try {
                const response = await fetch("http://localhost:11000/patient/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch patient data");

                const data = await response.json();

                const ensureArray = (value: any) => {
                    if (Array.isArray(value)) {
                        return value;
                    }
                    if (typeof value === 'string' && value.trim() !== '') {
                        return [value];
                    }
                    return [];
                };

                const patient: PatientData = {
                    name: `${data.firstName || ''} ${data.lastName || ''}`,
                    age: data.age || 0,
                    gender: data.gender || 'Unknown',
                    email: data.email || 'N/A',
                    phoneNumber: data.phoneNumber || 'N/A',
                    allergies: ensureArray(data.allergies),
                    restrictions: ensureArray(data.restrictions),
                    medicalDevices: ensureArray(data.medicalDevices),
                    recentSurgery: data.recentSurgery || "N/A",
                    currentMedications: ensureArray(data.currentMedications),
                    emergencyContacts: [
                        {
                            name: data.primaryContactName || "N/A",
                            phone: data.primaryContactPhone || "N/A",
                            relationship: "Primary Contact",
                        },
                        {
                            name: data.secondaryContactName || "N/A",
                            phone: data.secondaryContactPhone || "N/A",
                            relationship: "Secondary Contact",
                        },
                    ].filter(contact => contact.name !== "N/A" || contact.phone !== "N/A"),
                };

                setPatientData(patient);
            } catch (err) {
                console.error("Error fetching patient data:", err);
                setError("Could not load patient information.");
            } finally {
                setLoading(false);
            }
        };

        const fetchReports = async () => {
            try {
                const response = await fetch("http://localhost:8083/reports/list", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch reports");

                const data = await response.json();
                setReports(data);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setReportsError("Could not load reports.");
            } finally {
                setReportsLoading(false);
            }
        };

        fetchPatientData();
        fetchReports();

        // Auto-slide for health advice
        adviceIntervalRef.current = setInterval(() => {
            setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % healthAdvices.length);
        }, 7000); // Change advice every 7 seconds

        return () => {
            if (adviceIntervalRef.current) {
                clearInterval(adviceIntervalRef.current); // Cleanup interval on component unmount
            }
        };
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-600">
            <div className="flex flex-col items-center">
                <Activity className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
                <p className="text-xl font-semibold">Loading your health data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-red-600">
            <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-xl font-medium text-center">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-6" variant="outline">Try Again</Button>
            </div>
        </div>
    );
    if (!patientData) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-600">
            <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
                <Info className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-xl font-medium text-center">No patient data available.</p>
            </div>
        </div>
    );

    const currentAdvice = healthAdvices[currentAdviceIndex];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 font-sans text-gray-800">
            {/* Fixed PatientNavBar */}
            <div className="fixed top-0 left-0 w-full z-30">
                <PatientNavBar />
            </div>

            {/* Main Content Area with margin to avoid navbar overlap */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 mt-20">

                {/* Welcome Title and Edit Profile Button */}
                <div className="mb-8 px-2 md:px-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 leading-tight">
                            Hello, {patientData.name.split(' ')[0]}!
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl">
                            Your personalized health journey, simplified.
                        </p>
                    </div>
                    <Button variant="outline" icon={Edit} className="w-fit text-blue-600 border-blue-200">
                        Edit Profile
                    </Button>
                </div>

                {/* Medical Overview & Health Insights */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-8">
                    {/* Medical Information Grid */}
                    <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MetricTile
                            icon={User}
                            title="Age & Gender"
                            value={patientData.age}
                            unit={patientData.gender}
                            colorScheme="blue"
                            description="Your primary demographic details"
                        />
                        <MetricTile
                            icon={AlertTriangle}
                            title="Allergies"
                            value={patientData.allergies.length > 0 ? patientData.allergies.join(", ") : "None"}
                            colorScheme="red"
                            description={patientData.allergies.length > 0 ? "Important alerts for your care" : "No known allergies listed"}
                        />
                        <MetricTile
                            icon={Heart}
                            title="Medical Devices"
                            value={patientData.medicalDevices.length > 0 ? patientData.medicalDevices.join(", ") : "None"}
                            colorScheme="purple"
                            description={patientData.medicalDevices.length > 0 ? "Devices supporting your health" : "No medical devices recorded"}
                        />
                        <MetricTile
                            icon={Scissors}
                            title="Recent Surgery"
                            value={patientData.recentSurgery || "None"}
                            colorScheme="orange"
                            description={patientData.recentSurgery ? "Latest surgical procedure details" : "No recent surgeries on record"}
                        />
                        <MetricTile
                            icon={Utensils}
                            title="Dietary Restrictions"
                            value={patientData.restrictions.length > 0 ? patientData.restrictions.join(", ") : "None"}
                            colorScheme="green"
                            description={patientData.restrictions.length > 0 ? "Key dietary considerations" : "No specific dietary needs"}
                        />
                        <MetricTile
                            icon={Pill}
                            title="Current Medications"
                            value={patientData.currentMedications.length > 0 ? patientData.currentMedications.join(", ") : "None"}
                            colorScheme="indigo"
                            description={patientData.currentMedications.length > 0 ? "Active prescriptions you're taking" : "No active medications"}
                        />
                    </div>

                    {/* Health Insights Sidebar */}
                    <div className="xl:col-span-1 space-y-5">
                        {/* Daily Health Tip */}
                        <Card className="p-6 h-auto flex flex-col shadow-xl bg-gradient-to-br from-white to-yellow-50/50 relative">
                            <CardTitle className="flex items-center text-xl font-bold text-yellow-700 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 shadow-md">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                Daily Health Tip
                            </CardTitle>
                            <CardContent className="flex-grow flex items-center justify-center text-center relative px-2 py-4">
                                {/* Fix dynamic color for icon */}
                                {(() => {
                                    const colorMap: Record<string, string> = {
                                        blue: 'text-blue-300',
                                        green: 'text-green-300',
                                        purple: 'text-purple-300',
                                        orange: 'text-orange-300',
                                        teal: 'text-teal-300',
                                        yellow: 'text-yellow-300',
                                    };
                                    const iconColor = colorMap[currentAdvice.color] || 'text-blue-300';
                                    const Icon = currentAdvice.icon;
                                    return <Icon className={`absolute top-2 right-2 w-8 h-8 ${iconColor} opacity-60`} />;
                                })()}
                                <p className="text-lg md:text-xl font-semibold text-gray-700 leading-relaxed transition-opacity duration-500 ease-in-out">
                                    {currentAdvice.text}
                                </p>
                            </CardContent>
                            <div className="flex justify-center mt-4 space-x-2">
                                {healthAdvices.map((_, idx) => (
                                    <button
                                        key={idx}
                                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                                            currentAdviceIndex === idx ? 'bg-yellow-600 scale-125' : 'bg-yellow-200'
                                        }`}
                                        onClick={() => {
                                            setCurrentAdviceIndex(idx);
                                            // Reset interval on manual interaction
                                            if (adviceIntervalRef.current) {
                                                clearInterval(adviceIntervalRef.current);
                                                adviceIntervalRef.current = setInterval(() => {
                                                    setCurrentAdviceIndex((prevIndex) => (prevIndex + 1) % healthAdvices.length);
                                                }, 7000);
                                            }
                                        }}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </Card>

                        {/* Emergency Contacts */}
                        <Card className="p-6 h-auto flex flex-col shadow-xl bg-gradient-to-br from-white to-red-50/50">
                            <CardTitle className="flex items-center text-xl font-bold text-red-700 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mr-3 shadow-md">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                                Emergency Contacts
                            </CardTitle>
                            <CardContent className="flex-grow space-y-3">
                                {patientData.emergencyContacts.length > 0 ? (
                                    patientData.emergencyContacts.map((contact, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-red-50 rounded-lg border border-red-100 flex flex-col hover:shadow-sm transition-shadow duration-200"
                                        >
                                            <p className="font-semibold text-lg text-gray-800">{contact.name}</p>
                                            <p className="text-sm text-gray-600 mb-1">{contact.relationship}</p>
                                            <div className="flex items-center text-base text-red-600">
                                                <Phone className="w-4 h-4 mr-1.5" />
                                                {contact.phone}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">No emergency contacts listed.</p>
                                )}
                            </CardContent>
                            <Button variant="outline" icon={PlusCircle} className="mt-4 text-red-600 border-red-200">
                                Add Contact
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Medical Reports Section - Table/List Format */}
                <Card className="p-6 md:p-8 shadow-xl bg-gradient-to-br from-white to-green-50/50">
                    <CardTitle className="flex items-center text-2xl font-bold text-green-700 mb-6">
                        <FileText className="w-6 h-6 text-white bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-2 mr-4 shadow-lg" />
                        Your Medical Reports
                    </CardTitle>
                    <CardContent>
                        {reportsLoading ? (
                            <div className="text-center py-8 text-lg text-gray-600">Loading reports...</div>
                        ) : reportsError ? (
                            <div className="text-red-500 text-center py-8">{reportsError}</div>
                        ) : reports.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-green-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Disease</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Created At</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-green-800 uppercase tracking-wider">Diagnosis</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {reports.slice(0, 8).map((report) => (
                                            <tr key={report.id} className="hover:bg-green-50 transition-colors cursor-pointer">
                                                <td className="px-4 py-3 font-medium text-gray-900">{report.disease}</td>
                                                <td className="px-4 py-3 text-gray-700">{report.createdAt ? new Date(report.createdAt).toLocaleString() : ''}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${report.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                                        {report.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <Hourglass className="w-3.5 h-3.5 mr-1" />}
                                                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-900">{report.diagnosis}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-gray-500 text-center py-8 text-lg flex flex-col items-center justify-center">
                                <Info className="w-10 h-10 text-gray-400 mb-4" />
                                <p className="mb-4">No reports available yet. Upload your first medical document!</p>
                                <Button variant="primary" icon={Upload}>
                                    Upload New Report
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}