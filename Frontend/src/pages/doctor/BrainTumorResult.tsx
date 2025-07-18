import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

const BrainTumorResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { originalUrl, segmentedUrl } = location.state || {};

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-4xl px-8 pt-8 pb-2">
                    <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left mb-4">
                        Brain Tumor Segmentation Result
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-4xl p-8">
                    <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold mb-2">Original Image</div>
                        {originalUrl && <img src={originalUrl} alt="Original" className="rounded-lg shadow max-h-96" />}
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="text-lg font-semibold mb-2">Segmented Image</div>
                        {segmentedUrl && <img src={segmentedUrl} alt="Segmented" className="rounded-lg shadow max-h-96" />}
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back</button>
            </div>
        </div>
    );
};

export default BrainTumorResult; 