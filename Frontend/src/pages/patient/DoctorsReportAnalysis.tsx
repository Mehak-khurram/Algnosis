import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload } from 'react-icons/fa';
import PatientNavBar from '../../components/PatientNavBar.tsx';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const DoctorsReportAnalysis = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans text-gray-800">
            {/* Main Content Area */}
            <div className="w-full max-w-6xl space-y-8">
                <PatientNavBar />


                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: PDF Viewer and Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* PDF Viewer */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4">Diagnostic Report</h2>
                            <div className="border border-gray-300 rounded-lg overflow-hidden relative">
                                <Document
                                    file="/path/to/sample.pdf"
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    className="w-full flex justify-center"
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        className="shadow-md"
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                </Document>
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-white bg-opacity-80 rounded-full px-4 py-2 shadow-lg space-x-4">
                                    <button
                                        className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                        onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                                        disabled={pageNumber <= 1}
                                        aria-label="Previous Page"
                                    >
                                        &larr; Previous
                                    </button>
                                    <span className="text-gray-700 font-medium text-sm">
                                        Page {pageNumber} of {numPages || '...'}
                                    </span>
                                    <button
                                        className="text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50"
                                        onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))}
                                        disabled={pageNumber >= (numPages || 1)}
                                        aria-label="Next Page"
                                    >
                                        Next &rarr;
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <a
                                    href="/path/to/sample.pdf"
                                    download
                                    className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors transform hover:scale-105"
                                >
                                    <FaDownload className="mr-3" /> Download Report
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Summary and Archives */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                            <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                                <span className="mr-2">📝</span> Report Summary
                            </h2>
                            <div className="space-y-3">
                                <p>
                                    <strong className="text-blue-600">Diagnosis:</strong> <span className="font-medium">Example Diagnosis</span>
                                </p>
                                <p>
                                    <strong className="text-blue-600">Recommendations:</strong> <span className="font-medium">Example Recommendations</span>
                                </p>
                                <p>
                                    <strong className="text-blue-600">Doctor:</strong> <span className="font-medium">Dr. John Doe, Cardiologist</span>
                                </p>
                            </div>
                        </div>

                        {/* Past Reports Archive */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center">
                                <span className="mr-2">📁</span> Past Reports Archive
                            </h2>
                            <ul className="space-y-3">
                                <li>
                                    <a href="/path/to/report1.pdf" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center">
                                        <FaDownload className="mr-2 text-sm" /> Report 1 - <span className="ml-1 font-medium">2024-05-01</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/path/to/report2.pdf" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center">
                                        <FaDownload className="mr-2 text-sm" /> Report 2 - <span className="ml-1 font-medium">2024-03-15</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/path/to/report3.pdf" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center">
                                        <FaDownload className="mr-2 text-sm" /> Report 3 - <span className="ml-1 font-medium">2023-12-10</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Note */}
            <footer className="w-full max-w-6xl mt-8 text-center text-gray-500 text-sm">
                <p className="p-4 bg-gray-100 rounded-lg">
                    <span className="font-semibold">Confidentiality Notice:</span> This report is for the patient's eyes only. Unauthorized access or sharing is strictly prohibited.
                </p>
            </footer>
        </div>
    );
};

export default DoctorsReportAnalysis;