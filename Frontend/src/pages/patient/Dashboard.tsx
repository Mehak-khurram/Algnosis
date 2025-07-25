// "use client"

// import { useState } from "react"
// import React, { useEffect } from "react";
// import {
//     User,
//     Calendar,
//     AlertTriangle,
//     Heart,
//     Scissors,
//     Utensils,
//     Pill,
//     Upload,
//     Phone,
//     Edit,
//     FileText,
//     Activity,
//     Shield,
//     Clock,
//     Smile,
//     Star,
// } from "lucide-react"
// import PatientNavBar from '../../components/PatientNavBar.tsx';

// // Simple Avatar, Button, Card, Badge components (replace with your UI library if available)
// const Avatar = ({ children, className }: any) => <div className={`inline-flex items-center justify-center bg-gray-200 ${className}`}>{children}</div>;
// const AvatarImage = ({ src, className }: any) => <img src={src} className={className} alt="avatar" />;
// const AvatarFallback = ({ children, className }: any) => <div className={className}>{children}</div>;
// const Button = ({ children, className, ...props }: any) => <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ''}`} {...props}>{children}</button>;
// const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
// const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
// const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
// const CardTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
// const CardDescription = ({ children, className }: any) => <div className={className}>{children}</div>;
// const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;



// interface EmergencyContact {
//     name: string;
//     phone: string;
// }

// interface PatientData {
//     name: string;
//     age: number;
//     gender: string;
//     email: string;
//     phoneNumber: string;
//     allergies: string[];
//     restrictions: string[];
//     medicalDevices: string[];
//     recentSurgery: string;
//     currentMedications: string[];
//     emergencyContacts: EmergencyContact[];
// }

// export function PatientDashboard() {
//     const [activeTab, setActiveTab] = useState("dashboard")

//     useEffect(() => {
//         const fetchPatientData = async () => {
//             const token = localStorage.getItem("token");

//             try {
//                 const response = await fetch("https://localhost:11000/patient/profile", {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch patient data");
//                 }

//                 const data = await response.json();

//                 const patient: PatientData = {
//                     name: `${data.firstName} ${data.lastName}`,
//                     age: data.age,
//                     gender: data.gender,
//                     email: data.email,
//                     phoneNumber: data.phoneNumber,
//                     allergies: data.allergies || [],
//                     restrictions: data.restrictions || [],
//                     medicalDevices: data.medicalDevices || [],
//                     recentSurgery: data.recentSurgery || "None",
//                     currentMedications: data.currentMedications || [],
//                     emergencyContacts: [
//                         {
//                             name: data.primaryContactName,
//                             phone: data.primaryContactPhone,
//                         },
//                         {
//                             name: data.secondaryContactName,
//                             phone: data.secondaryContactPhone,
//                         },
//                     ],
//                 };

//                 setPatientData(patient);
//             } catch (err) {
//                 console.error(err);
//                 setError("Could not load patient information.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPatientData();
//     }, []);

//     if (loading) return <div>Loading patient data...</div>;
//     if (error) return <div>{error}</div>;
//     if (!patientData) return <div>No patient data available.</div>;

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//             <PatientNavBar />
//             {/* Header */}
//             <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm rounded-b-3xl">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between items-center h-16">
//                         <div className="flex items-center space-x-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
//                                 <Activity className="w-6 h-6 text-white" />
//                             </div>
//                             <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                                 Algnosis
//                             </h1>
//                         </div>
//                         <nav className="flex space-x-8">
//                             {["Dashboard", "Doctors", "Profile", "Logout"].map((item) => (
//                                 <button
//                                     key={item}
//                                     className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-full ${item === "Dashboard"
//                                         ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
//                                         : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
//                                         }`}
//                                 >
//                                     {item}
//                                 </button>
//                             ))}
//                         </nav>
//                     </div>
//                 </div>
//             </header>

//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Patient Header */}
//                 <Card className="mb-8 border-0 shadow-xl rounded-3xl bg-gradient-to-r from-white to-blue-50/50 overflow-hidden">
//                     <CardContent className="p-8">
//                         <div className="flex items-start justify-between">
//                             <div className="flex items-center space-x-6">
//                                 <div className="relative">
//                                     <Avatar className="w-24 h-24 border-4 border-white shadow-xl rounded-3xl">
//                                         <AvatarImage
//                                             src={getAvatarImage(patientData.gender) || "/placeholder.svg"}
//                                             className="rounded-3xl"
//                                         />
//                                         <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-2xl font-bold rounded-3xl">
//                                             {patientData.name
//                                                 .split(" ")
//                                                 .map((n) => n[0])
//                                                 .join("")}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                     <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
//                                         <Smile className="w-4 h-4 text-white" />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <div className="flex items-center space-x-3 mb-2">
//                                         <h2 className="text-3xl font-bold text-gray-800">{patientData.name}</h2>
//                                     </div>
//                                     <div className="flex flex-wrap gap-3 mb-4">
//                                         <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 rounded-full px-4 py-1">
//                                             <User className="w-3 h-3 mr-1" />
//                                             Age: {patientData.age}
//                                         </Badge>
//                                         <Badge className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 border-0 rounded-full px-4 py-1">
//                                             Gender: {patientData.gender}
//                                         </Badge>
//                                     </div>
//                                     <div className="flex flex-wrap gap-3">
//                                     </div>
//                                 </div>
//                             </div>
//                             <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
//                                 <Edit className="w-4 h-4 mr-2" />
//                                 Edit Profile
//                             </Button>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
//                     {/* Main Content */}
//                     <div className="xl:col-span-2 space-y-10">
//                         {/* Medical Information Grid */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
//                             {/* Age & Gender */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-blue-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <User className="w-6 h-6 text-white" />
//                                         </div>
//                                         AGE / GENDER
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-3xl font-bold text-gray-800">
//                                         {patientData.age} / {patientData.gender}
//                                     </p>
//                                 </CardContent>
//                             </Card>

//                             {/* Allergies */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-red-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <AlertTriangle className="w-6 h-6 text-white" />
//                                         </div>
//                                         ALLERGIES
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-xl font-semibold text-red-700">{patientData.allergies.join(", ")}</p>
//                                 </CardContent>
//                             </Card>

//                             {/* Medical Devices */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-purple-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <Heart className="w-6 h-6 text-white" />
//                                         </div>
//                                         MEDICAL DEVICES
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-xl font-semibold text-purple-700">{patientData.devices.join(", ")}</p>
//                                 </CardContent>
//                             </Card>

//                             {/* Recent Surgery */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-orange-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <Scissors className="w-6 h-6 text-white" />
//                                         </div>
//                                         RECENT SURGERY
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-xl font-semibold text-orange-700">{patientData.recentSurgery}</p>
//                                 </CardContent>
//                             </Card>

//                             {/* Dietary Restrictions */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-green-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <Utensils className="w-6 h-6 text-white" />
//                                         </div>
//                                         DIETARY RESTRICTIONS
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-xl font-semibold text-green-700">{patientData.diet}</p>
//                                 </CardContent>
//                             </Card>

//                             {/* Current Medications */}
//                             <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-indigo-50/30 hover:scale-105 p-6 flex flex-col justify-between">
//                                 <CardHeader className="pb-5 rounded-t-3xl">
//                                     <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
//                                         <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
//                                             <Pill className="w-6 h-6 text-white" />
//                                         </div>
//                                         CURRENT MEDICATIONS
//                                     </CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <p className="text-xl font-semibold text-indigo-700">{patientData.medications.join(", ")}</p>
//                                 </CardContent>
//                             </Card>
//                         </div>

//                         {/* Upload Section */}
//                     </div>

//                     {/* Sidebar */}
//                     <div className="space-y-10">
//                         {/* Emergency Contacts */}
//                         <Card className="min-h-[180px] border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-red-50/30 p-8 flex flex-col justify-between">
//                             <CardHeader className="rounded-t-3xl mb-2">
//                                 <CardTitle className="flex items-center text-xl text-red-800">
//                                     <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mr-4">
//                                         <Shield className="w-6 h-6 text-white" />
//                                     </div>
//                                     Emergency Contacts
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="space-y-6">
//                                 {patientData.emergencyContacts.map((contact, index) => (
//                                     <div
//                                         key={index}
//                                         className="p-5 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 hover:shadow-md transition-all duration-200"
//                                     >
//                                         <div className="flex-1">
//                                             <p className="font-semibold text-lg text-gray-800">{contact.name}</p>
//                                             <p className="text-base text-gray-600 mb-2">{contact.relationship}</p>
//                                             <div className="flex items-center text-base text-blue-600">
//                                                 <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-2">
//                                                     <Phone className="w-4 h-4" />
//                                                 </div>
//                                                 {contact.phone}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </CardContent>
//                         </Card>


//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default PatientDashboard; 

"use client"

import React, { useEffect, useState } from "react"
import {
    User, AlertTriangle, Heart, Scissors, Utensils, Pill, Activity, Edit, Phone, Smile, Shield
} from "lucide-react"
import PatientNavBar from '../../components/PatientNavBar.tsx'

const Avatar = ({ children, className }: any) => <div className={`inline-flex items-center justify-center bg-gray-200 ${className}`}>{children}</div>;
const AvatarImage = ({ src, className }: any) => <img src={src} className={className} alt="avatar" />;
const AvatarFallback = ({ children, className }: any) => <div className={className}>{children}</div>;
const Button = ({ children, className, ...props }: any) => <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ''}`} {...props}>{children}</button>;
const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;

interface EmergencyContact {
    name: string;
    phone: string;
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

const getAvatarImage = (gender: string) => {
    if (gender.toLowerCase() === "male") return "/male-avatar.png";
    if (gender.toLowerCase() === "female") return "/female-avatar.png";
    return "/placeholder.svg";
};

export function PatientDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("https://localhost:11000/patient/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch patient data");
                }

                const data = await response.json();

                const patient: PatientData = {
                    name: `${data.firstName} ${data.lastName}`,
                    age: data.age,
                    gender: data.gender,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    allergies: data.allergies || [],
                    restrictions: data.restrictions || [],
                    medicalDevices: data.medicalDevices || [],
                    recentSurgery: data.recentSurgery || "None",
                    currentMedications: data.currentMedications || [],
                    emergencyContacts: [
                        {
                            name: data.primaryContactName,
                            phone: data.primaryContactPhone,
                        },
                        {
                            name: data.secondaryContactName,
                            phone: data.secondaryContactPhone,
                        },
                    ],
                };

                setPatientData(patient);
            } catch (err) {
                console.error(err);
                setError("Could not load patient information.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-500">Loading patient data...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (!patientData) return <div>No patient data available.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <PatientNavBar />

            <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 shadow-sm rounded-b-3xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Algnosis
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Card className="mb-8 border-0 shadow-xl rounded-3xl bg-gradient-to-r from-white to-blue-50/50 overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-white shadow-xl rounded-3xl">
                                        <AvatarImage
                                            src={getAvatarImage(patientData.gender)}
                                            className="rounded-3xl"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-2xl font-bold rounded-3xl">
                                            {patientData.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                                        <Smile className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{patientData.name}</h2>
                                    <div className="flex flex-wrap gap-3">
                                        <Badge className="bg-blue-100 text-blue-700">
                                            <User className="w-3 h-3 mr-1" /> Age: {patientData.age}
                                        </Badge>
                                        <Badge className="bg-indigo-100 text-indigo-700">
                                            Gender: {patientData.gender}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoCard icon={<User />} title="AGE / GENDER" value={`${patientData.age} / ${patientData.gender}`} />
                            <InfoCard icon={<AlertTriangle />} title="ALLERGIES" value={patientData.allergies.join(", ") || "None"} />
                            <InfoCard icon={<Heart />} title="MEDICAL DEVICES" value={patientData.medicalDevices.join(", ") || "None"} />
                            <InfoCard icon={<Scissors />} title="RECENT SURGERY" value={patientData.recentSurgery} />
                            <InfoCard icon={<Utensils />} title="RESTRICTIONS" value={patientData.restrictions.join(", ") || "None"} />
                            <InfoCard icon={<Pill />} title="CURRENT MEDICATIONS" value={patientData.currentMedications.join(", ") || "None"} />
                        </div>
                    </div>

                    <div className="space-y-10">
                        <Card className="p-8 rounded-3xl shadow-2xl bg-gradient-to-br from-white to-red-50/30">
                            <CardHeader className="mb-2">
                                <CardTitle className="flex items-center text-xl text-red-800">
                                    <Shield className="w-6 h-6 mr-3" /> Emergency Contacts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {patientData.emergencyContacts.map((contact, index) => (
                                    <div key={index} className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <p className="font-semibold text-gray-800">{contact.name}</p>
                                        <div className="flex items-center text-blue-600 mt-1">
                                            <Phone className="w-4 h-4 mr-2" /> {contact.phone}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const InfoCard = ({ icon, title, value }: { icon: JSX.Element, title: string, value: string }) => (
    <Card className="min-h-[180px] p-6 rounded-3xl shadow-2xl hover:shadow-lg transition-transform hover:scale-105 bg-gradient-to-br from-white to-blue-50/20">
        <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-gray-700 text-base font-semibold">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4 text-white">
                    {icon}
                </div>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-xl font-semibold text-gray-800">{value}</p>
        </CardContent>
    </Card>
);

export default PatientDashboard;