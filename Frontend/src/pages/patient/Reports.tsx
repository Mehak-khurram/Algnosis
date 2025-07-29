import React, { useState } from "react";
import { Upload, FileText, Brain, TreesIcon as Lungs, Droplets, ChevronLeft, ChevronRight } from "lucide-react";
import PatientNavBar from "../../components/PatientNavBar.tsx";
import { useNavigate } from "react-router-dom";

const diseases = [
    {
        id: "pneumonia",
        name: "Pneumonia",
        icon: Lungs,
        description: "Pneumonia is a lung infection that can cause serious illness, especially in vulnerable populations. Early and accurate diagnosis is essential for effective treatment.",
        required: "Chest X-Ray (PA view preferred)",
        requiredColor: "text-blue-800",
        fileLabel: "Reference X-Ray",
        sample: "/sample-xray-pneumonia.jpg",
        iconColor: "text-blue-700",
        headerColor: "text-blue-900",
    },
    {
        id: "tb",
        name: "Tuberculosis (TB)",
        icon: Lungs,
        description: "Tuberculosis is a bacterial infection that primarily affects the lungs. Prompt detection and treatment are critical to prevent complications and transmission.",
        required: "Chest X-Ray (PA view preferred)",
        requiredColor: "text-pink-800",
        fileLabel: "Reference X-Ray",
        sample: "/sample-xray-tb.jpg",
        iconColor: "text-pink-700",
        headerColor: "text-pink-900",
    },
    {
        id: "brain-tumor",
        name: "Brain Tumor",
        icon: Brain,
        description: "Brain tumors are abnormal growths of cells within the brain. MRI scans are the standard for detection and assessment of brain tumors.",
        required: "MRI Scan (T1/T2-weighted preferred)",
        requiredColor: "text-purple-800",
        fileLabel: "Reference MRI",
        sample: "/sample-mri-brain-tumor.jpg",
        iconColor: "text-purple-700",
        headerColor: "text-purple-900",
    },
    {
        id: "anemia",
        name: "Anemia",
        icon: Droplets,
        description: "Anemia is a condition characterized by a deficiency of red blood cells or hemoglobin. Diagnosis is based on laboratory analysis of a complete blood count (CBC) report.",
        required: "Blood Report (CBC)",
        requiredColor: "text-orange-800",
        fileLabel: "Reference CBC",
        sample: "/sample-cbc-anemia.jpg",
        iconColor: "text-orange-700",
        headerColor: "text-orange-900",
    },
];

export default function Reports() {
    const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [success, setSuccess] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

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

    const handleSubmit = async () => {
        if (selectedDisease && uploadedFile) {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", uploadedFile);

            const endpoints: Record<string, string> = {
                pneumonia: "http://localhost:3000/patient/upload/pneumonia"
            };

            const endpoint = endpoints[selectedDisease];

            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error("Upload failed");
                }

                const result = await response.json();
                console.log("Upload result:", result);

                // Generate a local preview URL
                const previewUrl = URL.createObjectURL(uploadedFile);

                // Navigate to ReportUploaded page with preview URL
                navigate("/patient/report-uploaded", { state: { report: result, disease: selectedDisease, fileName: uploadedFile.name, previewUrl } });

                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                setUploadedFile(null);
                setSelectedDisease(null);
            } catch (error) {
                console.error("Upload error:", error);
                alert("Upload failed. Please try again.");
            }
        }
    };

    // Slider navigation
    const goToPrev = () => setCurrentSlide((prev) => (prev === 0 ? diseases.length - 1 : prev - 1));
    const goToNext = () => setCurrentSlide((prev) => (prev === diseases.length - 1 ? 0 : prev + 1));

    return (
        <div className="min-h-screen bg-white">
            <PatientNavBar />
            <div className="container mx-auto px-4 py-8 max-w-4xl pt-20">
                {/* Disease Explanation Slider */}
                <section className="mb-10 flex flex-col items-center">
                    <div className="relative w-full max-w-2xl mx-auto">
                        <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center">
                            <div className="flex items-center mb-3">
                                {React.createElement(diseases[currentSlide].icon, { className: `w-6 h-6 mr-2 ${diseases[currentSlide].iconColor}` })}
                                <h2 className={`text-lg font-bold ${diseases[currentSlide].headerColor}`}>About {diseases[currentSlide].name}</h2>
                            </div>
                            <p className="text-gray-800 mb-2 text-center">{diseases[currentSlide].description}</p>
                            <p className="text-gray-700 mb-2 text-center"><span className={`font-semibold ${diseases[currentSlide].requiredColor}`}>Required file:</span> {diseases[currentSlide].required}</p>
                            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
                                <div className="w-44 h-32 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                                    <img src={diseases[currentSlide].sample} alt={diseases[currentSlide].fileLabel} className="object-contain h-full" />
                                </div>
                                <span className="text-xs text-gray-500">Reference Image</span>
                            </div>
                        </div>
                        {/* Slider Arrows */}
                        <button onClick={goToPrev} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"><ChevronLeft className="w-5 h-5 text-gray-700" /></button>
                        <button onClick={goToNext} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-gray-100 transition"><ChevronRight className="w-5 h-5 text-gray-700" /></button>
                        {/* Progress Dots */}
                        <div className="flex justify-center mt-4 space-x-2">
                            {diseases.map((_, idx) => (
                                <span key={idx} className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-blue-600' : 'bg-gray-300'}`}></span>
                            ))}
                        </div>
                    </div>
                </section>
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
                                onClick={() => setSelectedDisease(disease.id)}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-md bg-gray-100`}>
                                    <Icon className="w-8 h-8 text-blue-600 drop-shadow" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-1">{disease.name}</h3>
                                    <p className="text-xs text-gray-500">{disease.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* File Requirements Info */}
                {selectedDisease && (
                    <div className="mb-8 rounded-3xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 p-6 border-2 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-500" /> Step 2: File Requirements
                        </h2>
                        <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100`}>
                                {React.createElement(selectedDiseaseData?.icon || Lungs, { className: "w-6 h-6 text-blue-600" })}
                            </div>
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">{selectedDiseaseData?.name} Diagnosis</h4>
                                <p className="text-gray-700 mb-2">{selectedDiseaseData?.description}</p>
                                <span className="bg-white border border-blue-200 text-blue-700 rounded-full px-3 py-1 text-xs font-semibold shadow">
                                    Required: {selectedDiseaseData?.required}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* File Upload */}
                {selectedDisease && (
                    <div className="mb-10 rounded-3xl shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 p-8 border-2 border-blue-200">
                        <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center">
                            <Upload className="w-5 h-5 mr-2 text-blue-500" /> Step 3: Upload Medical File
                        </h2>
                        <p className="text-blue-700 mb-4">Upload your file for analysis</p>
                        <div
                            className={`border-4 border-dashed rounded-2xl p-10 text-center transition-colors bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 ${dragActive ? "border-blue-500 bg-blue-50" : "border-blue-300 hover:border-blue-400"}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={() => {
                                const input = document.createElement("input");
                                input.type = "file";
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
                                            Drop your file here
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