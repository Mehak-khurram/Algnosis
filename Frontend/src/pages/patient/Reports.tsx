import React, { useState } from "react";
import { Upload, FileText, Brain, TreesIcon as Lungs, Droplets } from "lucide-react";
import PatientNavBar from "../../components/PatientNavBar.tsx";

const diseases = [
    {
        id: "pneumonia",
        name: "Pneumonia",
        icon: Lungs,
        fileType: "X-Ray",
        description: "Chest X-Ray images are required for pneumonia diagnosis",
        acceptedFormats: ".jpg, .jpeg, .png, .pdf",
        gradient: "from-blue-400 via-blue-500 to-blue-600",
        iconBg: "bg-gradient-to-br from-blue-200 to-blue-400",
    },
    {
        id: "tb",
        name: "Tuberculosis (TB)",
        icon: Lungs,
        fileType: "X-Ray",
        description: "Chest X-Ray images are required for TB diagnosis",
        acceptedFormats: ".jpg, .jpeg, .png, .pdf",
        gradient: "from-pink-400 via-pink-500 to-pink-600",
        iconBg: "bg-gradient-to-br from-pink-200 to-pink-400",
    },
    {
        id: "brain-tumor",
        name: "Brain Tumor",
        icon: Brain,
        fileType: "MRI Scan",
        description: "MRI scan images are required for brain tumor diagnosis",
        acceptedFormats: ".jpg, .jpeg, .png, .pdf",
        gradient: "from-purple-400 via-purple-500 to-purple-600",
        iconBg: "bg-gradient-to-br from-purple-200 to-purple-400",
    },
    {
        id: "anemia",
        name: "Anemia",
        icon: Droplets,
        fileType: "Blood Report (CBC)",
        description: "Complete Blood Count (CBC) report is required for anemia diagnosis",
        acceptedFormats: ".pdf, .jpg, .jpeg, .png",
        gradient: "from-orange-400 via-pink-400 to-pink-500",
        iconBg: "bg-gradient-to-br from-orange-200 to-pink-200",
    },
];

export default function Reports() {
    const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [success, setSuccess] = useState(false);

    const selectedDiseaseData = diseases.find((d) => d.id === selectedDisease);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setUploadedFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadedFile(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (selectedDisease && uploadedFile) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
            setUploadedFile(null);
            setSelectedDisease(null);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <PatientNavBar />
            <div className="container mx-auto px-4 py-8 max-w-4xl pt-20">
                {/* Header */}
                <div className="text-center mb-8">
                    <p className="text-gray-700 max-w-2xl mx-auto text-lg font-medium">
                        Select the condition you'd like to diagnose and upload the required medical files. Our AI system will
                        analyze your files and provide diagnostic insights.
                    </p>
                </div>

                {/* Disease Selection */}
                <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {diseases.map((disease) => {
                        const Icon = disease.icon;
                        return (
                            <div
                                key={disease.id}
                                className={`cursor-pointer rounded-3xl border-2 p-6 flex items-center space-x-4 shadow-lg transition-all duration-200 bg-white hover:scale-[1.03] hover:shadow-2xl border-transparent ${selectedDisease === disease.id ? `ring-4 ring-blue-400 scale-105` : ""}`}
                                style={{ background: `linear-gradient(120deg, var(--tw-gradient-stops))` }}
                                onClick={() => setSelectedDisease(disease.id)}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md ${disease.iconBg}`}>
                                    <Icon className="w-8 h-8 text-white drop-shadow" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{disease.name}</h3>
                                    <p className="text-sm text-gray-700 mb-1">Requires: <span className="font-semibold text-blue-700">{disease.fileType}</span></p>
                                    <p className="text-xs text-gray-500">{disease.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* File Requirements Info */}
                {selectedDiseaseData && (
                    <div className="mb-8 rounded-3xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 border-2 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-500" /> Step 2: File Requirements
                        </h2>
                        <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedDiseaseData.iconBg}`}>
                                <selectedDiseaseData.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">{selectedDiseaseData.name} Diagnosis</h4>
                                <p className="text-gray-700 mb-2">{selectedDiseaseData.description}</p>
                                <span className="bg-white border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold shadow">
                                    Accepted formats: {selectedDiseaseData.acceptedFormats}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Upload */}
                {selectedDiseaseData && (
                    <div className="mb-10 rounded-3xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 border-2 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                            <Upload className="w-5 h-5 mr-2 text-blue-500" /> Step 3: Upload Medical File
                        </h2>
                        <p className="text-blue-700 mb-4">Upload your {selectedDiseaseData.fileType.toLowerCase()} file for analysis</p>
                        <div
                            className={`border-4 border-dashed rounded-2xl p-10 text-center transition-colors bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 ${dragActive ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:border-blue-400"}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = selectedDiseaseData.acceptedFormats;
                                input.onchange = (e) => {
                                    const target = e.target as HTMLInputElement;
                                    if (target.files && target.files[0]) {
                                        setUploadedFile(target.files[0]);
                                    }
                                };
                                input.click();
                            }}
                            style={{ cursor: "pointer" }}
                        >
                            {uploadedFile ? (
                                <div className="space-y-4">
                                    <FileText className="w-16 h-16 text-blue-600 mx-auto" />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</p>
                                        <p className="text-sm text-gray-600">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setUploadedFile(null);
                                        }}
                                        className="border border-blue-300 text-blue-600 hover:bg-blue-50 rounded-full px-4 py-2 text-sm font-semibold shadow"
                                    >
                                        Remove File
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="w-16 h-16 text-blue-400 mx-auto" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-700 mb-2">
                                            Drop your {selectedDiseaseData.fileType.toLowerCase()} here
                                        </p>
                                        <p className="text-gray-500 mb-4">or click to browse files</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                {selectedDisease && uploadedFile && (
                    <div className="text-center">
                        <button
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-all duration-200"
                        >
                            Submit for Diagnosis
                        </button>
                        <p className="text-sm text-gray-500 mt-2">
                            Your file will be analyzed securely and results will be available shortly
                        </p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white px-8 py-4 rounded-full shadow-2xl z-50 font-semibold text-lg border-2 border-white">
                        File uploaded successfully! Your diagnosis will be processed.
                    </div>
                )}
            </div>
        </div>
    );
} 