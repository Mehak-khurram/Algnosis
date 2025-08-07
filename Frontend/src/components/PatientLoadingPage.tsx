import React from 'react';
import { Activity, Heart, Loader2 } from 'lucide-react';
import PatientNavBar from './PatientNavBar.tsx';

interface PatientLoadingPageProps {
    message?: string;
    subtitle?: string;
    showNavbar?: boolean;
}

const PatientLoadingPage: React.FC<PatientLoadingPageProps> = ({ 
    message = "Loading...", 
    subtitle = "Please wait while we fetch your information",
    showNavbar = true 
}) => {
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-100 font-sans">
            {showNavbar && <PatientNavBar />}
            <div className={`flex-1 flex items-center justify-center ${showNavbar ? 'pt-16' : ''}`}>
                <div className="text-center animate-fade-in">
                    {/* Animated loading icon with medical theme */}
                    <div className="relative mb-8">
                        <div className="w-24 h-24 mx-auto relative">
                            {/* Main spinning loader */}
                            <Loader2 className="w-24 h-24 text-blue-600 animate-spin absolute inset-0" />
                            
                            {/* Floating medical icons */}
                            <div className="absolute inset-0 animate-pulse">
                                <Heart className="w-6 h-6 text-red-500 absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '0s' }} />
                                <Activity className="w-6 h-6 text-green-500 absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '0.5s' }} />
                            </div>
                        </div>
                    </div>

                    {/* Loading text */}
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-gray-800 animate-pulse">{message}</h2>
                        <p className="text-gray-600 text-lg max-w-md mx-auto">{subtitle}</p>
                    </div>

                    {/* Progress indicator dots */}
                    <div className="flex justify-center space-x-2 mt-8">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>

                    {/* Medical-themed background elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                        <div className="absolute top-20 left-20 w-32 h-32 border border-blue-300 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-24 h-24 border border-green-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-10 w-16 h-16 border border-red-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-1/3 right-10 w-20 h-20 border border-purple-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
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

export default PatientLoadingPage;