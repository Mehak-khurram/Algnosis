import React from "react";
// --- Navigation Bar ---
import { useState } from "react";
import { Menu, X, Stethoscope, ArrowRight, Play, Shield, Clock, Users, MessageSquare, Brain, FileText, Heart, Droplets, FileCheck, Smartphone, Mail, Phone, MapPin } from "lucide-react";
import LoginForm from "../components/LoginForm.tsx";
import SignupForm from "../components/SignupForm.tsx";
const Button = (props: any) => <button {...props} className={"px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition " + (props.className || "")}>{props.children}</button>;

// --- How It Works Section Data ---
const steps = [
    { icon: MessageSquare, title: "Describe Symptoms", description: "Tell us about your symptoms using our intuitive chat interface. Our AI guides you through relevant questions.", step: "01" },
    { icon: Brain, title: "AI Analysis", description: "Our advanced AI processes your information using medical databases and evidence-based algorithms.", step: "02" },
    { icon: FileText, title: "Get Results", description: "Receive detailed insights, potential conditions, and personalized recommendations within minutes.", step: "03" }
];

const diagnosisTypes = [
    { icon: Heart, title: "Pneumonia Detection", description: "Advanced chest X-ray analysis using AI to detect pneumonia patterns and lung inflammation with high precision.", color: "bg-blue-500/10 text-blue-600 border-blue-200", features: ["Chest X-ray Analysis", "Lung Pattern Recognition", "Severity Assessment"] },
    { icon: Heart, title: "Tuberculosis (TB) Screening", description: "Comprehensive TB detection through medical imaging and symptom analysis for early intervention.", color: "bg-red-500/10 text-red-600 border-red-200", features: ["Medical Imaging", "Symptom Correlation", "Risk Assessment"] },
    { icon: Brain, title: "Brain Tumor Detection", description: "MRI and CT scan analysis to identify potential brain tumors and abnormal tissue formations.", color: "bg-purple-500/10 text-purple-600 border-purple-200", features: ["MRI Analysis", "CT Scan Review", "Tumor Classification"] },
    { icon: Droplets, title: "Anemia Diagnosis", description: "Blood test interpretation and symptom analysis to detect various types of anemia conditions.", color: "bg-orange-500/10 text-orange-600 border-orange-200", features: ["Blood Test Analysis", "Symptom Evaluation", "Type Classification"] }
];


const features = [
    { icon: Brain, title: "Advanced AI Technology", description: "Our machine learning algorithms are trained on millions of medical cases for accurate diagnosis." },
    { icon: Clock, title: "Instant Results", description: "Get comprehensive health insights in under 5 minutes, available 24/7 whenever you need them." },
    { icon: Shield, title: "Privacy & Security", description: "Your health data is protected with enterprise-grade encryption and HIPAA compliance." },
    { icon: Users, title: "Expert-Verified", description: "All AI recommendations are validated by licensed medical professionals and updated regularly." },
    { icon: FileCheck, title: "Detailed Reports", description: "Receive comprehensive reports you can share with your healthcare provider for further consultation." },
    { icon: Smartphone, title: "Easy to Use", description: "Simple, intuitive interface works on any device. No medical knowledge required to get started." }
];

// Update Navigation to accept showSignup/setShowSignup props
const Navigation = ({ showLogin, setShowLogin, showSignup, setShowSignup }: { showLogin: boolean, setShowLogin: (v: boolean) => void, showSignup: boolean, setShowSignup: (v: boolean) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Algnosis</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#home" className="text-gray-500 hover:text-blue-600 transition">Home</a>
                        <a href="#how-it-works" className="text-gray-500 hover:text-blue-600 transition">How It Works</a>
                        <a href="#features" className="text-gray-500 hover:text-blue-600 transition">Features</a>
                        <a href="#about" className="text-gray-500 hover:text-blue-600 transition">About</a>
                        <Button onClick={() => setShowLogin(true)} className="bg-blue-600 text-white"><span>Sign In</span></Button>
                        <Button onClick={() => setShowSignup(true)} className="bg-purple-600 hover:bg-purple-700 text-white"><span>Get Started</span></Button>
                    </div>
                    <div className="md:hidden">
                        <Button onClick={() => setIsOpen(!isOpen)} className="bg-transparent text-gray-900 p-2">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                            <a href="#home" className="block px-3 py-2 text-gray-500 hover:text-blue-600">Home</a>
                            <a href="#how-it-works" className="block px-3 py-2 text-gray-500 hover:text-blue-600">How It Works</a>
                            <a href="#features" className="block px-3 py-2 text-gray-500 hover:text-blue-600">Features</a>
                            <a href="#about" className="block px-3 py-2 text-gray-500 hover:text-blue-600">About</a>
                            <div className="pt-4 space-y-2">
                                <Button onClick={() => setShowLogin(true)} className="w-full bg-blue-600 text-white"><span>Sign In</span></Button>
                                <Button onClick={() => setShowSignup(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white"><span>Get Started</span></Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// --- Hero Section ---
const HeroSection = () => (
    <section id="home" className="min-h-screen flex items-center pt-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            AI-Powered
                            <span className="block text-blue-600">Medical Diagnosis</span>
                            Made Simple
                        </h1>
                        <p className="text-lg text-gray-600 max-w-xl">
                            Get accurate medical insights in minutes. Our advanced AI analyzes your symptoms and provides personalized health recommendations from trusted medical professionals.
                        </p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
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
                        <Button className="text-lg bg-blue-600 text-white"><a href="#signup" className="flex items-center">Start Diagnosis Now<ArrowRight className="w-5 h-5 ml-2" /></a></Button>
                        <Button className="bg-gray-200 text-gray-900 text-lg"><Play className="w-5 h-5" /> Watch Demo</Button>
                    </div>
                </div>
                <div className="relative">
                    {/* Placeholder for hero image and floating cards */}
                    <div className="w-full h-80 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400">[Medical Hero Image]</div>
                </div>
            </div>
        </div>
    </section>
);

// --- How It Works Section ---
const HowItWorksSection = () => (
    <section id="how-it-works" className="py-20 bg-[#f7f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get medical insights in three simple steps. Our AI-powered platform makes healthcare accessible and efficient.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-16">
                {steps.map((step, index) => (
                    <div key={index} className="relative">
                        <div className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col items-center">
                            <div className="absolute -top-4 left-8">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{step.step}</div>
                            </div>
                            <div className="mb-6 mt-4">
                                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center">
                                    <step.icon className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                                <ArrowRight className="w-6 h-6 text-blue-600" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="text-center">
                <Button className="text-lg bg-blue-600 text-white"><ArrowRight className="w-5 h-5 mr-2" />Try It Now - It's Free</Button>
                <p className="text-sm text-gray-500 mt-3">No account required • Results in under 5 minutes</p>
            </div>
        </div>
    </section>
);

// --- Diagnosis Types Section ---
const DiagnosisTypesSection = () => (
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Can Algnosis Diagnose?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Our AI-powered platform specializes in detecting and analyzing various medical conditions with precision and speed, helping you get the insights you need.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {diagnosisTypes.map((type, index) => (
                    <div key={index} className="">
                        <div className="bg-[#f7f8fa] p-8 rounded-2xl border border-gray-200 h-full">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${type.color}`}>
                                    <type.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.title}</h3>
                                    <p className="text-gray-600 text-sm">{type.description}</p>
                                </div>
                            </div>
                            <div className="space-y-2 mb-6">
                                {type.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-2">
                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                        <span className="text-sm text-gray-600">{feature}</span>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full bg-blue-600 text-white"><Stethoscope className="w-4 h-4" />Start {type.title.split(' ')[0]} Diagnosis</Button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-center">
                <div className="bg-blue-600/5 rounded-2xl p-8 border border-blue-600/10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Not Sure Which Diagnosis You Need?</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Our AI assistant will guide you through a comprehensive assessment to determine the most appropriate diagnostic path based on your symptoms and medical history.</p>
                    <Button className="text-lg bg-purple-600 hover:bg-purple-700 text-white"><Brain className="w-5 h-5" />Start General Assessment</Button>
                </div>
            </div>
        </div>
    </section>
);

// --- Features Section ---
const FeaturesSection = () => (
    <section id="features" className="py-20 bg-[#f7f8fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Algnosis?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Combining cutting-edge AI technology with medical expertise to provide reliable, accessible healthcare insights.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col items-center">
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-20 text-center">
                <div className="bg-blue-600/5 rounded-2xl p-8 border border-blue-600/10">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Healthcare Professionals</h3>
                        <p className="text-gray-600 mb-6">Our platform is used by thousands of patients and recommended by healthcare providers worldwide.</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">50k+</div>
                                <div className="text-sm text-gray-600">Active Users</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">98%</div>
                                <div className="text-sm text-gray-600">Accuracy Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">500+</div>
                                <div className="text-sm text-gray-600">Medical Partners</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-600">24/7</div>
                                <div className="text-sm text-gray-600">Support</div>
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
    <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">Algnosis</span>
                    </div>
                    <p className="text-gray-600 text-sm">AI-powered medical diagnosis platform providing accurate health insights and personalized recommendations.</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#home" className="hover:text-blue-600 transition">Home</a></li>
                        <li><a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a></li>
                        <li><a href="#features" className="hover:text-blue-600 transition">Features</a></li>
                        <li><a href="#about" className="hover:text-blue-600 transition">About</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li><a href="#" className="hover:text-blue-600 transition">Help Center</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition">Contact Us</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-blue-600 transition">Terms of Service</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>support@algnosis.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>1-800-MEDIDI</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>San Francisco, CA</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-blue-600/5 rounded-2xl p-6 text-center border border-blue-600/10">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to get started?</h3>
                    <p className="text-gray-600 mb-4 text-sm">Join thousands of users getting instant medical insights.</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">Start Your Diagnosis</Button>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-600">© 2024 Algnosis. All rights reserved.</p>
                <p className="text-xs text-gray-500 mt-2 md:mt-0">Not intended to replace professional medical advice.</p>
            </div>
        </div>
    </footer>
);

// --- Main Home Page ---
const Home = () => {
    const [showLogin, setShowLogin] = React.useState(false);
    const [showSignup, setShowSignup] = React.useState(false);
    return (
        <div className="bg-[#f7f8fa] min-h-screen">
            <Navigation showLogin={showLogin} setShowLogin={setShowLogin} showSignup={showSignup} setShowSignup={setShowSignup} />
            <HeroSection />
            <HowItWorksSection />
            <DiagnosisTypesSection />
            <FeaturesSection />
            <Footer />
            {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
            {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
        </div>
    );
};

export default Home;