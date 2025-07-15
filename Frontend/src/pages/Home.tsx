import React, { useState } from 'react';
import LoginForm from '../components/LoginForm.tsx';
import SignupForm from '../components/SignupForm.tsx';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';


const Home: React.FC = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-black/10 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-2">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-black tracking-wide">Algnosis</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-4 py-2 text-black font-medium rounded bg-white border border-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black/20"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowSignup(true)}
                                className="px-4 py-2 text-black font-medium rounded bg-white border border-black hover:bg-black hover:text-white transition focus:outline-none focus:ring-2 focus:ring-black/20"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable Sections */}
            <main className="flex-1 w-full overflow-y-auto">
                {/* Hero Section */}
                <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-pink-50">
                    {/* 3D Background Animation replaced with Sketchfab Embed */}
                    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center">
                        <div className="sketchfab-embed-wrapper w-full h-full flex items-center justify-center">
                            <iframe
                                title="Lungs - normal study"
                                frameBorder="0"
                                allowFullScreen
                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                src="https://sketchfab.com/models/79149850d98842f981a1c60e7498413b/embed?autospin=1&autostart=1&ui_hint=0"
                                style={{ width: '100%', height: '100%', minHeight: '500px', background: 'white' }}
                            ></iframe>
                        </div>
                    </div>
                    {/* Hero Content Overlay */}
                    <div className="relative z-10 max-w-4xl w-full px-4 flex flex-col items-center justify-center text-center py-24">
                        <motion.h2
                            className="text-[12vw] font-extrabold tracking-tight text-gray-900 drop-shadow-sm whitespace-nowrap"
                            style={{ fontFamily: 'Inter, Arial Black, Arial, sans-serif', letterSpacing: '0.13em' }}
                            initial={{ opacity: 0, y: 60, letterSpacing: '0.5em' }}
                            animate={{ opacity: 1, y: 0, letterSpacing: '0.13em' }}
                            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                        >
                            {Array.from('ALGNOSIS').map((char, idx) => (
                                <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.08, duration: 0.5, type: 'spring', stiffness: 200 }}
                                    style={{ display: 'inline-block' }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.h2>
                    </div>
                </section>

                {/* Section 2 */}
                <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-blue-100">
                    <div className="relative z-10 max-w-4xl w-full px-4 flex flex-col items-center justify-center text-center py-24">
                        <h2 className="text-[7vw] font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Section 2</h2>
                        <p className="mt-4 text-lg text-gray-700">This is a placeholder for Section 2 content.</p>
                    </div>
                </section>

                {/* Section 3 */}
                <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-50 to-yellow-100">
                    <div className="relative z-10 max-w-4xl w-full px-4 flex flex-col items-center justify-center text-center py-24">
                        <h2 className="text-[7vw] font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Section 3</h2>
                        <p className="mt-4 text-lg text-gray-700">This is a placeholder for Section 3 content.</p>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 to-pink-100">
                    <div className="relative z-10 max-w-4xl w-full px-4 flex flex-col items-center justify-center text-center py-24">
                        <h2 className="text-[7vw] font-extrabold tracking-tight text-gray-900 drop-shadow-sm">Section 4</h2>
                        <p className="mt-4 text-lg text-gray-700">This is a placeholder for Section 4 content.</p>
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

function LungsModel() {
    const { scene } = useGLTF('/lungs.glb');
    return <primitive object={scene} scale={2.2} />;
} 