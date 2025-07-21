"use client"

import { useState } from "react"
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
} from "lucide-react"
import PatientNavBar from '../../components/PatientNavBar.tsx';

// Simple Avatar, Button, Card, Badge components (replace with your UI library if available)
const Avatar = ({ children, className }: any) => <div className={`inline-flex items-center justify-center bg-gray-200 ${className}`}>{children}</div>;
const AvatarImage = ({ src, className }: any) => <img src={src} className={className} alt="avatar" />;
const AvatarFallback = ({ children, className }: any) => <div className={className}>{children}</div>;
const Button = ({ children, className, ...props }: any) => <button className={`px-4 py-2 rounded-lg font-semibold transition ${className || ''}`} {...props}>{children}</button>;
const Card = ({ children, className }: any) => <div className={`bg-white rounded-2xl shadow border border-gray-200 ${className}`}>{children}</div>;
const CardContent = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardHeader = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardTitle = ({ children, className }: any) => <div className={className}>{children}</div>;
const CardDescription = ({ children, className }: any) => <div className={className}>{children}</div>;
const Badge = ({ children, className }: any) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;

export function PatientDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")

    const patientData = {
        name: "John Doe",
        age: 32,
        gender: "Male",
        allergies: ["Penicillin", "Peanuts"],
        devices: ["Pacemaker"],
        recentSurgery: "Appendectomy (2022)",
        diet: "Vegetarian",
        medications: ["Aspirin", "Metformin"],
        emergencyContacts: [
            { name: "Jane Doe", relationship: "Wife (Primary)", phone: "+1 555-123-4567" },
            { name: "Robert Doe", relationship: "Brother (Secondary)", phone: "+1 555-987-6543" },
        ],
    }

    // Gender-specific avatar images
    const getAvatarImage = (gender: string) => {
        return gender.toLowerCase() === "male"
            ? "/placeholder.svg?height=80&width=80&text=👨‍⚕️"
            : "/placeholder.svg?height=80&width=80&text=👩‍⚕️"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <PatientNavBar />
            {/* Header */}
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
                        <nav className="flex space-x-8">
                            {["Dashboard", "Doctors", "Profile", "Logout"].map((item) => (
                                <button
                                    key={item}
                                    className={`text-sm font-medium transition-all duration-200 px-4 py-2 rounded-full ${item === "Dashboard"
                                        ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Patient Header */}
                <Card className="mb-8 border-0 shadow-xl rounded-3xl bg-gradient-to-r from-white to-blue-50/50 overflow-hidden">
                    <CardContent className="p-8">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="relative">
                                    <Avatar className="w-24 h-24 border-4 border-white shadow-xl rounded-3xl">
                                        <AvatarImage
                                            src={getAvatarImage(patientData.gender) || "/placeholder.svg"}
                                            className="rounded-3xl"
                                        />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white text-2xl font-bold rounded-3xl">
                                            {patientData.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-400 rounded-full border-4 border-white flex items-center justify-center">
                                        <Smile className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h2 className="text-3xl font-bold text-gray-800">{patientData.name}</h2>
                                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                                    </div>
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        <Badge className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-0 rounded-full px-4 py-1">
                                            <User className="w-3 h-3 mr-1" />
                                            Age: {patientData.age}
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 border-0 rounded-full px-4 py-1">
                                            Gender: {patientData.gender}
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-red-100 to-pink-200 text-red-700 border-0 rounded-full px-4 py-1">
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Allergies: {patientData.allergies.join(", ")}
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-0 rounded-full px-4 py-1">
                                            <Heart className="w-3 h-3 mr-1" />
                                            Device: {patientData.devices.join(", ")}
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 border-0 rounded-full px-4 py-1">
                                            <Scissors className="w-3 h-3 mr-1" />
                                            Surgery: {patientData.recentSurgery}
                                        </Badge>
                                        <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-0 rounded-full px-4 py-1">
                                            <Utensils className="w-3 h-3 mr-1" />
                                            Diet: {patientData.diet}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    {/* Main Content */}
                    <div className="xl:col-span-2 space-y-10">
                        {/* Medical Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                            {/* Age & Gender */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-blue-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                        AGE / GENDER
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-gray-800">
                                        {patientData.age} / {patientData.gender}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Allergies */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-red-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                                            <AlertTriangle className="w-6 h-6 text-white" />
                                        </div>
                                        ALLERGIES
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold text-red-700">{patientData.allergies.join(", ")}</p>
                                </CardContent>
                            </Card>

                            {/* Medical Devices */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-purple-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        MEDICAL DEVICES
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold text-purple-700">{patientData.devices.join(", ")}</p>
                                </CardContent>
                            </Card>

                            {/* Recent Surgery */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-orange-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mr-4">
                                            <Scissors className="w-6 h-6 text-white" />
                                        </div>
                                        RECENT SURGERY
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold text-orange-700">{patientData.recentSurgery}</p>
                                </CardContent>
                            </Card>

                            {/* Dietary Restrictions */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-green-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mr-4">
                                            <Utensils className="w-6 h-6 text-white" />
                                        </div>
                                        DIETARY RESTRICTIONS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold text-green-700">{patientData.diet}</p>
                                </CardContent>
                            </Card>

                            {/* Current Medications */}
                            <Card className="min-h-[180px] min-w-0 border-0 shadow-2xl hover:shadow-2xl transition-all duration-300 rounded-3xl bg-gradient-to-br from-white to-indigo-50/30 hover:scale-105 p-6 flex flex-col justify-between">
                                <CardHeader className="pb-5 rounded-t-3xl">
                                    <CardTitle className="text-base font-semibold text-gray-700 flex items-center">
                                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                                            <Pill className="w-6 h-6 text-white" />
                                        </div>
                                        CURRENT MEDICATIONS
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-xl font-semibold text-indigo-700">{patientData.medications.join(", ")}</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Upload Section */}
                        <Card className="min-h-[220px] border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-blue-50/50 p-10 flex flex-col justify-center">
                            <CardHeader className="rounded-t-3xl mb-4">
                                <CardTitle className="flex items-center text-2xl text-blue-800">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                                        <Upload className="w-7 h-7 text-white" />
                                    </div>
                                    Upload Medical Reports
                                </CardTitle>
                                <CardDescription className="text-lg text-gray-600 mt-2">
                                    Upload your medical reports or X-rays securely
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="border-2 border-dashed border-blue-300 rounded-3xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <FileText className="w-10 h-10 text-white" />
                                    </div>
                                    <p className="text-xl font-medium text-blue-700 mb-2">Upload Report / X Ray</p>
                                    <p className="text-base text-gray-600 mb-4">Upload your medical reports or X-rays securely</p>
                                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl px-10 py-4 shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                                        Choose Files
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-10">
                        {/* Emergency Contacts */}
                        <Card className="min-h-[180px] border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-red-50/30 p-8 flex flex-col justify-between">
                            <CardHeader className="rounded-t-3xl mb-2">
                                <CardTitle className="flex items-center text-xl text-red-800">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center mr-4">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    Emergency Contacts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {patientData.emergencyContacts.map((contact, index) => (
                                    <div
                                        key={index}
                                        className="p-5 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-100 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex-1">
                                            <p className="font-semibold text-lg text-gray-800">{contact.name}</p>
                                            <p className="text-base text-gray-600 mb-2">{contact.relationship}</p>
                                            <div className="flex items-center text-base text-blue-600">
                                                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                {contact.phone}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="min-h-[180px] border-0 shadow-2xl rounded-3xl bg-gradient-to-br from-white to-indigo-50/30 p-8 flex flex-col justify-between">
                            <CardHeader className="rounded-t-3xl mb-2">
                                <CardTitle className="flex items-center text-xl text-indigo-800">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <Button className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-2xl py-4 shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                                    <Calendar className="w-5 h-5 mr-4" />
                                    Schedule Appointment
                                </Button>
                                <Button className="w-full justify-start bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 text-blue-600 border border-blue-200 rounded-2xl py-4 shadow-md hover:shadow-lg transition-all duration-200 text-lg">
                                    <FileText className="w-5 h-5 mr-4" />
                                    View Medical History
                                </Button>
                                <Button className="w-full justify-start bg-gradient-to-r from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 text-purple-600 border border-purple-200 rounded-2xl py-4 shadow-md hover:shadow-lg transition-all duration-200 text-lg">
                                    <Pill className="w-5 h-5 mr-4" />
                                    Medication Reminders
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PatientDashboard; 