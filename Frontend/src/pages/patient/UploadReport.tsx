import React, { useRef, useState } from 'react';
import PatientNavBar from '../../components/PatientNavBar.tsx';
import { useNavigate } from 'react-router-dom';

const UploadReport: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setSuccess(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;
        setUploading(true);
        setSuccess(false);
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
            const response = await fetch('http://localhost:8000/api/diagnosis/upload/', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) throw new Error('Upload failed');
            const data = await response.json();
            setUploading(false);
            setSuccess(true);
            navigate('/patient/diagnosis-result', { state: { result: data.result } });
        } catch (error) {
            setUploading(false);
            alert('Failed to upload and process the report.');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-pink-50">
            <PatientNavBar />
            <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 animate-fadein">
                <div className="bg-white/90 rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center border border-blue-100">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Upload Report / X Ray</h1>
                    <p className="text-gray-700 mb-6 text-center">Upload your medical reports or X-rays securely. Accepted formats: PDF, JPG, PNG.</p>
                    <form onSubmit={handleUpload} className="w-full flex flex-col items-center gap-6">
                        <div
                            className="w-full flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-xl p-8 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg className="w-12 h-12 text-blue-900 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                            <span className="text-blue-900 font-semibold">{selectedFile ? selectedFile.name : 'Click to select a file'}</span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!selectedFile || uploading}
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 shadow-md disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                        {success && (
                            <div className="w-full text-center text-green-600 font-semibold mt-2 animate-fadein">
                                File uploaded successfully!
                            </div>
                        )}
                    </form>
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

export default UploadReport; 