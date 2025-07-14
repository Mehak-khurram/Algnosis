import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatientNavBar from '../../components/PatientNavBar.tsx';

const DiagnosisResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result;

    if (!result) {
        // If no result, redirect back to upload
        navigate('/patient/upload-report');
        return null;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-pink-50">
            <PatientNavBar />
            <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 animate-fadein">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center border border-blue-100">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">Diagnosis Result</h1>
                    <div className="text-lg text-gray-800 mb-2">
                        <span className="font-semibold">Diagnosis:</span> {result.diagnosis}
                    </div>
                    <div className="text-lg text-gray-800 mb-6">
                        <span className="font-semibold">Confidence:</span> {(result.confidence * 100).toFixed(2)}%
                    </div>
                    <button
                        className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                        onClick={() => navigate('/patient/upload-report')}
                    >
                        Upload Another Report
                    </button>
                </div>
            </div>
            <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 1s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </div>
    );
};

export default DiagnosisResult; 