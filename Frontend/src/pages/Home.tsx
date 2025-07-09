import React, { useState } from 'react';
import LoginForm from '../components/LoginForm.tsx';
import SignupForm from '../components/SignupForm.tsx';

const Home: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="animated-navbar-bg border-b border-white/20 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center space-x-3">
                            <img src="/Logo.png" alt="Algnosis Logo" className="h-12 w-12 object-contain" />
                            <h1 className="text-2xl font-bold text-white">Algnosis</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-4 py-2 text-white font-medium rounded hover:bg-blue-800 transition bg-blue-900 border border-blue-900"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowSignup(true)}
                                className="px-4 py-2 text-white font-medium rounded hover:bg-pink-700 transition bg-pink-600 border border-pink-600"
                            >
                                Sign Up
                            </button>
                            <button
                                className="px-4 py-2 text-white font-medium rounded hover:bg-gray-200 hover:text-blue-900 transition bg-white/20 border border-white/30"
                            >
                                Help
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable Sections */}
            <main className="flex-1 w-full overflow-y-auto">
                {/* Hero Section */}
                <section className="w-full py-24 bg-gradient-to-br from-blue-50 to-pink-50 flex items-center justify-center">
                    <div className="max-w-6xl w-full px-4 flex flex-col lg:flex-row items-center justify-center gap-16">
                        {/* Large image on the left */}
                        <div className="w-full lg:w-1/2 flex justify-center items-center mb-8 lg:mb-0">
                            <img src="/image1.png" alt="Medical Hero" className="w-[32rem] h-[32rem] object-contain" style={{ background: 'transparent' }} />
                        </div>
                        {/* Text and buttons on the right */}
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <h2 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight drop-shadow-sm">
                                Welcome to Algnosis
                            </h2>
                            <p className="text-xl text-gray-700 mb-10">
                                Your comprehensive medical platform for patients, healthcare providers, and administrators. Experience seamless healthcare management and access.
                            </p>
                            <div className="flex flex-col sm:flex-row lg:justify-start justify-center gap-4">
                                <button
                                    onClick={() => setShowSignup(true)}
                                    className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition duration-200 transform hover:scale-105 shadow-md"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition duration-200 transform hover:scale-105 shadow-md border border-blue-900"
                                >
                                    Log In
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-20 flex items-center justify-center bg-white">
                    <div className="max-w-4xl w-full px-4">
                        <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Platform Interfaces</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm flex flex-col items-center">
                                <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Patient Portal</h4>
                                <p className="text-gray-700 text-center">Access your medical records and appointments</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm flex flex-col items-center">
                                <div className="w-14 h-14 bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Healthcare Provider</h4>
                                <p className="text-gray-700 text-center">Manage patients and medical services</p>
                            </div>
                            <div className="bg-blue-50 rounded-xl p-8 border border-blue-100 shadow-sm flex flex-col items-center">
                                <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Admin Panel</h4>
                                <p className="text-gray-700 text-center">System administration and management</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-blue-100 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <p className="text-center text-gray-500 text-sm">
                        © 2024 Algnosis. All rights reserved.
                    </p>
                </div>
            </footer>
            {/* Modals */}
            {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
            {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
        </div>
    );
};

export default Home; 