import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import { 
    Upload, 
    FileText, 
    Brain, 
    TreesIcon as Lungs, 
    Droplets, 
    AlertCircle,
    CheckCircle,
    ArrowLeft,
    Info,
    Shield,
    Clock,
    Activity,
    ChevronLeft,
    ChevronRight,
    Play,
    Pause,
    Heart,
    Stethoscope,
    Microscope
} from "lucide-react";

// Disease/report types configuration
const diseases = [
    {
        id: "pneumonia",
        name: "Pneumonia",
        icon: Lungs,
        description: "Upload chest X-ray for pneumonia detection and analysis",
        required: "Chest X-Ray (PA view preferred)",
        fileTypes: ".jpg,.jpeg,.png,.pdf",
        bgColor: "from-blue-500 to-blue-600",
        lightBg: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
    },
    {
        id: "tb",
        name: "Tuberculosis (TB)",
        icon: Lungs,
        description: "Upload chest X-ray for tuberculosis screening and detection",
        required: "Chest X-Ray (PA view preferred)",
        fileTypes: ".jpg,.jpeg,.png,.pdf",
        bgColor: "from-pink-500 to-pink-600",
        lightBg: "bg-pink-50",
        textColor: "text-pink-700",
        borderColor: "border-pink-200",
    },
    {
        id: "brain-tumor",
        name: "Brain Tumor",
        icon: Brain,
        description: "Upload MRI scan for brain tumor detection and analysis",
        required: "MRI Scan (T1/T2-weighted preferred)",
        fileTypes: ".jpg,.jpeg,.png,.pdf",
        bgColor: "from-purple-500 to-purple-600",
        lightBg: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
    },
    {
        id: "anemia",
        name: "Anemia",
        icon: Droplets,
        description: "Upload blood test report for anemia diagnosis",
        required: "Blood Report (CBC)",
        fileTypes: ".jpg,.jpeg,.png,.pdf",
        bgColor: "from-orange-500 to-orange-600",
        lightBg: "bg-orange-50",
        textColor: "text-orange-700",
        borderColor: "border-orange-200",
    },
];

// Slider content for diseases and upload requirements
const sliderContent = [
    {
        id: 1,
        title: "Pneumonia Detection",
        subtitle: "Upload chest X-rays for accurate pneumonia diagnosis",
        description: "Pneumonia is a serious lung infection that can be life-threatening if not diagnosed early. Our AI analyzes chest X-rays to detect signs of pneumonia with high accuracy, helping doctors provide timely treatment.",
        bgGradient: "from-blue-500 via-blue-600 to-blue-700",
        icon: Lungs,
        features: ["Chest X-Ray Required", "PA View Preferred", "JPG/PNG/PDF Accepted"],
        uploadType: "Chest X-Ray",
        diseaseInfo: "Lung infection causing inflammation in air sacs"
    },
    {
        id: 2,
        title: "Tuberculosis Screening",
        subtitle: "Upload chest X-rays for TB detection and analysis",
        description: "Tuberculosis (TB) is a contagious bacterial infection that primarily affects the lungs. Early detection through chest X-ray analysis is crucial for effective treatment and preventing transmission to others.",
        bgGradient: "from-emerald-500 via-teal-600 to-cyan-700",
        icon: Lungs,
        features: ["Chest X-Ray Required", "PA View Preferred", "High Sensitivity"],
        uploadType: "Chest X-Ray",
        diseaseInfo: "Bacterial infection primarily affecting the lungs"
    },
    {
        id: 3,
        title: "Brain Tumor Analysis",
        subtitle: "Upload MRI scans for comprehensive brain tumor detection",
        description: "Brain tumors require precise imaging for accurate diagnosis. Our advanced AI analyzes MRI scans to detect abnormal brain tissue growth and provide detailed analysis to assist medical professionals.",
        bgGradient: "from-purple-500 via-violet-600 to-purple-700",
        icon: Brain,
        features: ["MRI Scan Required", "T1/T2 Weighted", "3D Analysis"],
        uploadType: "MRI Scan",
        diseaseInfo: "Abnormal growth of cells within the brain"
    },
    {
        id: 4,
        title: "Anemia Diagnosis",
        subtitle: "Upload CBC reports for comprehensive anemia analysis",
        description: "Anemia occurs when your blood lacks enough healthy red blood cells. Our system analyzes Complete Blood Count (CBC) reports to identify different types of anemia and provide insights for proper treatment.",
        bgGradient: "from-orange-500 via-amber-600 to-yellow-600",
        icon: Droplets,
        features: ["CBC Report Required", "Blood Count Analysis", "Multiple Types Detected"],
        uploadType: "CBC Blood Report",
        diseaseInfo: "Condition with insufficient healthy red blood cells"
    }
];

// UI Components
const Card = ({ children, className = "", ...props }: any) => (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`} {...props}>
        {children}
    </div>
);

const Button = ({ children, className = "", variant = "primary", icon: Icon, disabled = false, ...props }: any) => {
    const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg transform hover:scale-105",
        secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
        outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
        success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-green-500",
        slider: "bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30 backdrop-blur-sm",
    };

    const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

    return (
        <button 
            className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${className}`} 
            disabled={disabled}
            {...props}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};

const UploadReport: React.FC = () => {
    const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [autoPlay, setAutoPlay] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const selectedDiseaseData = diseases.find(d => d.id === selectedDisease);

    // Auto-slide functionality
    React.useEffect(() => {
        if (!autoPlay) return;
        
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [autoPlay]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % sliderContent.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setSuccess(false);
            setError(null);
        }
    };

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
            setSelectedFile(e.dataTransfer.files[0]);
            setSuccess(false);
            setError(null);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile || !selectedDisease) return;

        setUploading(true);
        setSuccess(false);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        const token = localStorage.getItem("token");

        const endpoints: Record<string, string> = {
            pneumonia: "http://localhost:8020/patient/upload/pneumonia",
            tb: "http://localhost:8020/patient/upload/tb",
            "brain-tumor": "http://localhost:8020/patient/upload/braintumor",
            anemia: "http://localhost:8020/patient/upload/anemia"
        };

        try {
            const endpoint = endpoints[selectedDisease];
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

            setUploading(false);
            setSuccess(true);
            
            // Navigate to success page or reports list after a short delay
            setTimeout(() => {
                navigate('/patient/submitted-reports');
            }, 2000);
        } catch (error) {
            setUploading(false);
            setError('Failed to upload and process the report. Please try again.');
        }
    };

    const resetSelection = () => {
        setSelectedDisease(null);
        setSelectedFile(null);
        setSuccess(false);
        setError(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const currentSlideData = sliderContent[currentSlide];

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
            <PatientNavBar />
            
            {/* Hero Slider Section - Full Width */}
            <div className="relative w-screen h-[calc(100vh-4rem)] overflow-hidden -mx-8 lg:-mx-0 mt-12">
                <div 
                    className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.bgGradient} transition-all duration-1000 ease-in-out`}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-10 left-20 w-32 h-32 border border-white rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-1/3 right-10 w-20 h-20 border border-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    </div>

                    <div className="relative z-10 h-full flex items-center justify-center px-8 pt-6">
                        <div className="max-w-7xl mx-auto w-full">
                            {/* Centered Content */}
                            <div className="text-white space-y-6 animate-fade-in text-center max-w-4xl mx-auto">
                                <div className="flex items-center justify-center gap-4 mb-6">
                                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <currentSlideData.icon className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{currentSlideData.title}</h1>
                                    <p className="text-lg md:text-xl text-white text-opacity-90 mb-6">{currentSlideData.subtitle}</p>
                                </div>

                                {/* Disease Information Card */}
                                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 border border-white border-opacity-20 max-w-2xl mx-auto">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <FileText className="w-6 h-6 text-white" />
                                        <h3 className="text-xl font-semibold text-white">Upload Requirement</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-white mb-3">{currentSlideData.uploadType}</p>
                                    <p className="text-white text-opacity-80 text-base mb-4">{currentSlideData.diseaseInfo}</p>
                                </div>
                                
                                <p className="text-base md:text-lg text-white text-opacity-80 leading-relaxed max-w-3xl mx-auto">
                                    {currentSlideData.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                                    {currentSlideData.features.map((feature, index) => (
                                        <div 
                                            key={index}
                                            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium text-white border border-white border-opacity-20"
                                        >
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                
                            </div>
                        </div>
                    </div>

                    {/* Left Arrow Button */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm z-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Arrow Button */}
                    <button
                        onClick={nextSlide}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm z-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                                         {/* Slider Dots */}
                     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                         {sliderContent.map((_, index) => (
                             <button
                                 key={index}
                                 onClick={() => goToSlide(index)}
                                 className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                     currentSlide === index
                                         ? 'bg-white scale-110'
                                         : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                                 }`}
                             />
                         ))}
                     </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-6xl mx-auto p-8">
                                 {/* Header */}
                 <div className="mb-8 border-b pb-6 border-gray-200">
                     <div>
                         <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Medical Report</h2>
                         <p className="text-gray-600 text-lg">Choose your report type and upload for AI-powered analysis</p>
                     </div>
                 </div>

                {!selectedDisease ? (
                    /* Disease Selection */
                    <div className="space-y-8">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Select Report Type</h3>
                            <p className="text-gray-600">Choose the type of medical report you want to upload for analysis</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {diseases.map((disease, index) => {
                                const Icon = disease.icon;
                                return (
                                    <Card
                                        key={disease.id}
                                        className="p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-blue-200 animate-fade-in-up"
                                        onClick={() => setSelectedDisease(disease.id)}
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div className={`w-16 h-16 bg-gradient-to-r ${disease.bgColor} rounded-full flex items-center justify-center mb-4 mx-auto`}>
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-gray-800 text-center mb-2">{disease.name}</h4>
                                        <p className="text-gray-600 text-center text-sm mb-4">{disease.description}</p>
                                        <div className={`${disease.lightBg} rounded-lg p-3 text-center`}>
                                            <p className={`text-sm font-medium ${disease.textColor}`}>
                                                Required: {disease.required}
                                            </p>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Information Section */}
                        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Info className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-blue-900 mb-2">Upload Guidelines</h4>
                                    <ul className="text-blue-800 space-y-2">
                                        <li className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            <span>Your medical data is encrypted and securely processed</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            <span>AI analysis typically takes 2-5 minutes</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Supported formats: JPG, PNG, PDF (max 10MB)</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    /* File Upload Section */
                    <div className="space-y-8">
                        {/* Selected Disease Header */}
                        <Card className={`p-6 bg-gradient-to-r ${selectedDiseaseData?.bgColor} text-white`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {selectedDiseaseData && (
                                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                            <selectedDiseaseData.icon className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedDiseaseData?.name} Analysis</h3>
                                        <p className="text-white text-opacity-90">{selectedDiseaseData?.description}</p>
                                    </div>
                                </div>
                                <Button 
                                    variant="secondary" 
                                    onClick={resetSelection}
                                    className="bg-white bg-opacity-20 text-white border-white border-opacity-30 hover:bg-opacity-30"
                                >
                                    Change Type
                                </Button>
                            </div>
                        </Card>

                        {/* Upload Form */}
                        <form onSubmit={handleUpload} className="space-y-6">
                            {/* File Drop Zone */}
                            <Card className="p-8">
                                <div
                                    className={`
                                        border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                                        ${dragActive 
                                            ? 'border-blue-400 bg-blue-50' 
                                            : selectedFile 
                                                ? 'border-green-400 bg-green-50' 
                                                : 'border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50'
                                        }
                                        cursor-pointer
                                    `}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept={selectedDiseaseData?.fileTypes}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    
                                    {selectedFile ? (
                                        <div className="space-y-4">
                                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                            <div>
                                                <h4 className="text-xl font-semibold text-green-700 mb-2">File Selected</h4>
                                                <p className="text-gray-700 font-medium">{selectedFile.name}</p>
                                                <p className="text-gray-500 text-sm">{formatFileSize(selectedFile.size)}</p>
                                            </div>
                                            <p className="text-green-600 text-sm">Click to select a different file</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-700 mb-2">Drop your file here</h4>
                                                <p className="text-gray-500">or click to browse</p>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Supports: {selectedDiseaseData?.fileTypes.replace(/\./g, '').toUpperCase()} • Max 10MB
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Error Message */}
                            {error && (
                                <Card className="p-4 bg-red-50 border-red-200">
                                    <div className="flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-500" />
                                        <p className="text-red-700">{error}</p>
                                    </div>
                                </Card>
                            )}

                            {/* Success Message */}
                            {success && (
                                <Card className="p-6 bg-green-50 border-green-200">
                                    <div className="text-center">
                                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                        <h4 className="text-lg font-semibold text-green-700 mb-2">Upload Successful!</h4>
                                        <p className="text-green-600">Your report has been uploaded and is being processed. Redirecting to reports page...</p>
                                    </div>
                                </Card>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 justify-end">
                                <Button 
                                    variant="outline" 
                                    type="button"
                                    onClick={resetSelection}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={!selectedFile || uploading || success}
                                    icon={uploading ? Activity : Upload}
                                    className={uploading ? "animate-pulse" : ""}
                                >
                                    {uploading ? 'Processing...' : 'Upload & Analyze'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default UploadReport;