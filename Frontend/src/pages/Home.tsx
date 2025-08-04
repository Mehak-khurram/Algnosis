import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Stethoscope, ArrowRight, Play, Shield, Clock, Users, MessageSquare, Brain, FileText, Heart, Droplets, FileCheck, Smartphone, Mail, Phone, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import LoginForm from "../components/LoginForm.tsx";
import SignupForm from "../components/SignupForm.tsx";

// Custom hook for scroll animation (fade-in, slide-up)
const useInView = (options: IntersectionObserverInit) => {
    const [ref, setRef] = useState<HTMLElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        if (!ref) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                // observer.unobserve(entry.target); // Uncomment to trigger animation only once
            } else {
                // setInView(false); // Uncomment to re-trigger animation on scroll out/in
            }
        }, options);

        observer.observe(ref);

        return () => {
            if (ref) {
                observer.unobserve(ref);
            }
        };
    }, [ref, options]);

    return [setRef, inView] as const;
};

// Reusable Button Component with Glass/Gradient Styling
const Button = ({ children, className = "", ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => {
    const baseColor = className.includes("bg-purple") ? "purple" : "blue";
    const fromColor = baseColor === "purple" ? "from-purple-500" : "from-blue-500";
    const toColor = baseColor === "purple" ? "to-purple-600" : "to-blue-600";
    const hoverFromColor = baseColor === "purple" ? "hover:from-purple-600" : "hover:from-blue-600";
    const hoverToColor = baseColor === "purple" ? "hover:to-purple-700" : "hover:to-blue-700";
    const focusRingColor = baseColor === "purple" ? "focus:ring-purple-500" : "focus:ring-blue-500";

    return (
        <button
            {...props}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ease-in-out
                       ${fromColor} ${toColor} text-white shadow-lg bg-gradient-to-br
                       ${hoverFromColor} ${hoverToColor} hover:shadow-xl
                       active:scale-98 focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-opacity-50
                       ${className}`}
        >
            {children}
        </button>
    );
};

// --- Navigation Bar ---
const Navigation = ({ showLogin, setShowLogin, showSignup, setShowSignup }: { showLogin: boolean, setShowLogin: (v: boolean) => void, showSignup: boolean, setShowSignup: (v: boolean) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Algnosis</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#home" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Home</a>
                        <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">How It Works</a>
                        <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">Features</a>
                        <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">About</a>
                        <Button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white shadow-md hover:shadow-lg"><span>Sign In</span></Button>
                        <Button onClick={() => setShowSignup(true)} className="bg-purple-600 text-white shadow-md hover:shadow-lg"><span>Get Started</span></Button>
                    </div>
                    <div className="md:hidden">
                        <Button onClick={() => setIsOpen(!isOpen)} className="bg-transparent text-gray-900 p-2 shadow-none hover:shadow-none active:scale-100">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            <a href="#home" className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">Home</a>
                            <a href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">How It Works</a>
                            <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">Features</a>
                            <a href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600 transition-colors duration-200">About</a>
                            <div className="pt-4 space-y-2">
                                <Button onClick={() => setShowLogin(true)} className="w-full shadow-md hover:shadow-lg"><span>Sign In</span></Button>
                                <Button onClick={() => setShowSignup(true)} className="w-full bg-purple-600 shadow-md hover:shadow-lg"><span>Get Started</span></Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// --- Hero Section ---
const HeroSection = () => {
    const [setRef, inView] = useInView({ threshold: 0.1 });

    return (
        <section id="home" className="min-h-screen flex items-center pt-16 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
            <div ref={setRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                                AI-Powered
                                <span className="block text-blue-600">Medical Diagnosis</span>
                                Made Simple
                            </h1>
                            <p className="text-lg text-gray-700 max-w-xl">
                                Get accurate medical insights in minutes. Our advanced AI analyzes your symptoms and provides personalized health recommendations from trusted medical professionals.
                            </p>
                        </div>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-blue-600" />
                                <span>HIPAA Compliant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-600" />
                                <span>24/7 Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-blue-600" />
                                <span>50k+ Patients</span>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="text-lg shadow-xl hover:shadow-2xl"><a href="#signup" className="flex items-center">Start Diagnosis Now<ArrowRight className="w-5 h-5 ml-2" /></a></Button>
                            <Button className="bg-gray-200 text-gray-900 text-lg shadow-md hover:shadow-lg active:scale-98 transition-all duration-200 ease-in-out">
                                <Play className="w-5 h-5 mr-2" /> Watch Demo
                            </Button>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-full h-auto flex items-center justify-center">
                            <img 
                                src="herosec.png" 
                                alt="AI Medical Scan" 
                                className="object-contain w-full h-auto" 
                                style={{ border: 'none', background: 'transparent' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- How It Works Section Data ---
const steps = [
    { icon: MessageSquare, title: "Describe Symptoms", description: "Tell us about your symptoms using our intuitive chat interface. Our AI guides you through relevant questions.", step: "01" },
    { icon: Brain, title: "AI Analysis", description: "Our advanced AI processes your information using medical databases and evidence-based algorithms.", step: "02" },
    { icon: FileText, title: "Get Results", description: "Receive detailed insights, potential conditions, and personalized recommendations within minutes.", step: "03" }
];

// New component for individual How It Works steps
const HowItWorksStep = ({ step, index }: { step: typeof steps[0], index: number }) => {
    const [setRef, inView] = useInView({ threshold: 0.2 });
    return (
        <div key={index} ref={setRef} className={`relative transition-all duration-700 ease-out delay-${index * 150} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
                <div className="absolute -top-4 left-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-md shadow-lg">{step.step}</div>
                </div>
                <div className="mb-6 mt-4">
                    <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <step.icon className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-center">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                </div>
            )}
        </div>
    );
};

const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">Get medical insights in three simple steps. Our AI-powered platform makes healthcare accessible and efficient.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {steps.map((step, index) => (
                    <HowItWorksStep key={index} step={step} index={index} />
                ))}
            </div>
            <div className="text-center">
                <Button className="text-lg shadow-xl hover:shadow-2xl"><ArrowRight className="w-5 h-5 mr-2" />Try It Now - It's Free</Button>
                <p className="text-sm text-gray-600 mt-3">No account required • Results in under 5 minutes</p>
            </div>
        </div>
    </section>
);

// --- Diagnosis Types Section Data ---
const diagnosisTypes = [
    { icon: Heart, title: "Pneumonia Detection", description: "Advanced chest X-ray analysis using AI to detect pneumonia patterns and lung inflammation with high precision.", color: "bg-blue-500/10 text-blue-600 border-blue-200", features: ["Chest X-ray Analysis", "Lung Pattern Recognition", "Severity Assessment"] },
    { icon: Heart, title: "Tuberculosis (TB) Screening", description: "Comprehensive TB detection through medical imaging and symptom analysis for early intervention.", color: "bg-red-500/10 text-red-600 border-red-200", features: ["Medical Imaging", "Symptom Correlation", "Risk Assessment"] },
    { icon: Brain, title: "Brain Tumor Detection", description: "MRI and CT scan analysis to identify potential brain tumors and abnormal tissue formations.", color: "bg-purple-500/10 text-purple-600 border-purple-200", features: ["MRI Analysis", "CT Scan Review", "Tumor Classification"] },
    { icon: Droplets, title: "Anemia Diagnosis", description: "Blood test interpretation and symptom analysis to detect various types of anemia conditions.", color: "bg-orange-500/10 text-orange-600 border-orange-200", features: ["Blood Test Analysis", "Symptom Evaluation", "Type Classification"] }
];

// New component for individual Diagnosis Type cards
const DiagnosisTypeCard = ({ type, index }: { type: typeof diagnosisTypes[0], index: number }) => {
    const [setRef, inView] = useInView({ threshold: 0.2 });
    return (
        <div key={index} ref={setRef} className={`transition-all duration-700 ease-out delay-${index * 150} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-xl h-full flex flex-col hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${type.color} shadow-inner`}>
                        <type.icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
                        <p className="text-gray-600 text-sm">{type.description}</p>
                    </div>
                </div>
                <div className="space-y-2 mb-6 flex-grow">
                    {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                            <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                    ))}
                </div>
                <Button className="w-full shadow-md hover:shadow-lg"><Stethoscope className="w-4 h-4 mr-2" />Start {type.title.split(' ')[0]} Diagnosis</Button>
            </div>
        </div>
    );
};

const DiagnosisTypesSection = () => (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Can Algnosis Diagnose?</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">Our AI-powered platform specializes in detecting and analyzing various medical conditions with precision and speed, helping you get the insights you need.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {diagnosisTypes.map((type, index) => (
                    <DiagnosisTypeCard key={index} type={type} index={index} />
                ))}
            </div>
            <div className="text-center">
                <div className="bg-blue-600/10 rounded-3xl p-8 border border-blue-600/20 shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Not Sure Which Diagnosis You Need?</h3>
                    <p className="text-gray-700 mb-6 max-w-2xl mx-auto">Our AI assistant will guide you through a comprehensive assessment to determine the most appropriate diagnostic path based on your symptoms and medical history.</p>
                    <Button className="text-lg bg-purple-600 shadow-xl hover:shadow-2xl"><Brain className="w-5 h-5 mr-2" />Start General Assessment</Button>
                </div>
            </div>
        </div>
    </section>
);

// --- Doctors Slider Section ---
interface Doctor {
    firstName: string;
    lastName: string;
    specialization: string;
    yearsOfExperience: number;
    qualifications: string;
    hospitalName: string;
    medicalLicenseNumber: string;
    shortBio: string;
}

const DoctorsSliderSection = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [numVisibleDoctors, setNumVisibleDoctors] = useState(1); // Default for mobile

    // Call useInView unconditionally at the top level
    const [setRef, inView] = useInView({ threshold: 0.1 });

    // Determine number of visible doctors based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) { // xl breakpoint
                setNumVisibleDoctors(4);
            } else if (window.innerWidth >= 1024) { // lg breakpoint
                setNumVisibleDoctors(3);
            } else if (window.innerWidth >= 768) { // md breakpoint
                setNumVisibleDoctors(2);
            } else {
                setNumVisibleDoctors(1);
            }
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Fetch doctors from the API
        fetch("http://localhost:50000/api/doctors")
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setDoctors(data.data);
                }
            })
            .catch((error) => console.error("Error fetching doctors:", error));
    }, []);

    // Automatic slider logic
    useEffect(() => {
        const maxIndex = Math.max(0, doctors.length - numVisibleDoctors);
        if (maxIndex === 0 && doctors.length > 0) { // If all doctors are visible, no need to slide
            setCurrentIndex(0);
            return;
        }
        if (doctors.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1));
        }, 4000); // Increased interval for smoother viewing
        return () => clearInterval(interval);
    }, [doctors, numVisibleDoctors]);

    const handleNext = useCallback(() => {
        const maxIndex = Math.max(0, doctors.length - numVisibleDoctors);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (maxIndex + 1));
    }, [doctors, numVisibleDoctors]);

    const handlePrev = useCallback(() => {
        const maxIndex = Math.max(0, doctors.length - numVisibleDoctors);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + (maxIndex + 1)) % (maxIndex + 1));
    }, [doctors, numVisibleDoctors]);

    if (doctors.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
            <div ref={setRef} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet Our Expert Doctors</h2>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">Our AI is built on the expertise of a network of highly qualified and experienced medical professionals. Get to know some of the minds behind our technology.</p>
                </div>
                <div className="relative">
                    <div className="overflow-hidden rounded-3xl shadow-2xl border border-gray-100 bg-white/70 backdrop-blur-md">
                        <div
                            className="flex transition-transform duration-700 ease-in-out py-4"
                            style={{ transform: `translateX(-${currentIndex * (100 / numVisibleDoctors)}%)` }}
                        >
                            {doctors.map((doctor, index) => (
                                <div
                                    key={index}
                                    className={`flex-shrink-0 p-4`}
                                    style={{ width: `${100 / numVisibleDoctors}%` }}
                                >
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col items-start h-full hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mb-4 shadow-inner">
                                            {doctor.firstName[0]}{doctor.lastName[0]}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.firstName} {doctor.lastName}</h3>
                                        <p className="text-blue-600 font-semibold text-sm mb-3">{doctor.specialization}</p>
                                        <p className="text-sm text-gray-700 flex-grow mb-4 leading-relaxed">{doctor.shortBio}</p>
                                        <ul className="text-xs text-gray-600 space-y-1 mt-auto">
                                            <li><strong>Experience:</strong> {doctor.yearsOfExperience} years</li>
                                            <li><strong>Hospital:</strong> {doctor.hospitalName}</li>
                                            <li><strong>Qualifications:</strong> {doctor.qualifications}</li>
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Navigation Buttons */}
                    {doctors.length > numVisibleDoctors && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-md text-gray-900 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-300 active:scale-95 z-10"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-md text-gray-900 p-3 rounded-full shadow-xl hover:bg-white transition-all duration-300 active:scale-95 z-10"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

// --- Features Section ---
const features = [
    { icon: Brain, title: "Advanced AI Technology", description: "Our machine learning algorithms are trained on millions of medical cases for accurate diagnosis." },
    { icon: Clock, title: "Instant Results", description: "Get comprehensive health insights in under 5 minutes, available 24/7 whenever you need them." },
    { icon: Shield, title: "Privacy & Security", description: "Your health data is protected with enterprise-grade encryption and HIPAA compliance." },
    { icon: Users, title: "Expert-Verified", description: "All AI recommendations are validated by licensed medical professionals and updated regularly." },
    { icon: FileCheck, title: "Detailed Reports", description: "Receive comprehensive reports you can share with your healthcare provider for further consultation." },
    { icon: Smartphone, title: "	Easy to Use", description: "Simple, intuitive interface works on any device. No medical knowledge required to get started." }
];

// New component for individual Feature cards
const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
    const [setRef, inView] = useInView({ threshold: 0.2 });
    return (
        <div key={index} ref={setRef} className={`transition-all duration-700 ease-out delay-${index * 150} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center hover:shadow-2xl transition-shadow duration-300">
                <div className="mb-4">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center shadow-inner">
                        <feature.icon className="w-7 h-7 text-blue-600" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm text-center">{feature.description}</p>
            </div>
        </div>
    );
};

const FeaturesSection = () => (
    <section id="features" className="py-20 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Algnosis?</h2>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">Combining cutting-edge AI technology with medical expertise to provide reliable, accessible healthcare insights.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <FeatureCard key={index} feature={feature} index={index} />
                ))}
            </div>
            <div className="mt-20 text-center">
                <div className="bg-blue-600/10 rounded-3xl p-8 border border-blue-600/20 shadow-xl">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h3>
                        <p className="text-gray-700 mb-6">Our platform is used by thousands of patients and recommended by healthcare providers worldwide.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-blue-600">50k+</div>
                                <div className="text-sm text-gray-700">Active Users</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-600">98%</div>
                                <div className="text-sm text-gray-700">Accuracy Rate</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-600">500+</div>
                                <div className="text-sm text-gray-700">Medical Partners</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-blue-600">24/7</div>
                                <div className="text-sm text-gray-700">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

// --- Footer ---
const Footer = () => (
    <footer className="bg-gradient-to-br from-white to-blue-50 border-t border-gray-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Algnosis</span>
                    </div>
                    <p className="text-gray-600 text-sm">AI-powered medical diagnosis platform providing accurate health insights and personalized recommendations.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#home" className="hover:text-blue-600 transition-colors duration-200">Home</a></li>
                        <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors duration-200">How It Works</a></li>
                        <li><a href="#features" className="hover:text-blue-600 transition-colors duration-200">Features</a></li>
                        <li><a href="#about" className="hover:text-blue-600 transition-colors duration-200">About</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-blue-600 transition-colors duration-200">Help Center</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors duration-200">Contact Us</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors duration-200">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition-colors duration-200">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            <span>support@algnosis.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span>1-800-MEDIDI</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>San Francisco, CA</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-100">
                <div className="bg-blue-600/10 rounded-3xl p-6 text-center border border-blue-600/20 shadow-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to get started?</h3>
                    <p className="text-gray-700 mb-4 text-sm">Join thousands of users getting instant medical insights.</p>
                    <Button className="bg-purple-600 shadow-xl hover:shadow-2xl">Start Your Diagnosis</Button>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">© 2024 Algnosis. All rights reserved.</p>
                <p className="text-xs text-gray-500 mt-2 md:mt-0">Not intended to replace professional medical advice.</p>
            </div>
        </div>
    </footer>
);

// --- Main Home Page ---
const Home = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    // Fade-in animation for the entire page on load
    const [pageLoaded, setPageLoaded] = useState(false);
    useEffect(() => {
        setPageLoaded(true);
    }, []);

    return (
        <div className={`font-sans bg-gradient-to-br from-white to-blue-50 min-h-screen transition-opacity duration-1000 ease-out ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Navigation showLogin={showLogin} setShowLogin={setShowLogin} showSignup={showSignup} setShowSignup={setShowSignup} />
            <HeroSection />
            <HowItWorksSection />
            <DiagnosisTypesSection />
            <DoctorsSliderSection />
            <FeaturesSection />
            <Footer />
            {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
            {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
        </div>
    );
};

export default Home;
