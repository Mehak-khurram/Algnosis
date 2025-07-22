import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
    onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        userType: 'patient'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { email, password, userType } = formData;
            const apiUrl = `http://localhost:9000/auth/${userType}/login`;
            const response = await axios.post(apiUrl, { email, password });
            if (response.status === 200 && response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (userType === 'patient') {
                    navigate('/patient/dashboard');
                } else {
                    navigate('/doctor/dashboard');
                }
            } else {
                setError('Invalid email or password.');
            }
        } catch (err: any) {
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Login to Algnosis</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        aria-label="Close login form"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                            User Type
                        </label>
                        <select
                            id="userType"
                            name="userType"
                            value={formData.userType}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        >
                            <option value="patient">Patient</option>
                            <option value="provider">Healthcare Provider</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    {error && <div className="text-red-500 text-center text-sm mt-2">{error}</div>}
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button className="text-blue-600 hover:text-purple-600 font-medium">
                            Sign up here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm; 