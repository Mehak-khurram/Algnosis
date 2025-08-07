import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

// Add this simple toast component at the top of your file
const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => (
    <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fadein">
        {message}
        <button className="ml-4 text-white font-bold" onClick={onClose}>×</button>
    </div>
);


const DoctorDiagnosisResult: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { result, profile, reportID, fileUrl, segmentedUrl, isBrainTumor } = location.state || {};
    const patientProfile = profile || {};

    const [doctorReport, setDoctorReport] = useState('');
    const [reportSaved, setReportSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedReport, setGeneratedReport] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [pdfSubmitted, setPdfSubmitted] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [editableDiagnosis, setEditableDiagnosis] = useState(result?.diagnosis || '');
    const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);
    const [savingDiagnosis, setSavingDiagnosis] = useState(false);
    
    // State for brain tumor image sliding
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // 0 for original, 1 for segmented


    useEffect(() => {
        // Ensure any state updates or side effects are properly managed
        console.log('DoctorDiagnosisResult - location.state:', location.state);
        console.log('DoctorDiagnosisResult - isBrainTumor:', isBrainTumor);
        console.log('DoctorDiagnosisResult - fileUrl:', fileUrl);
        console.log('DoctorDiagnosisResult - segmentedUrl:', segmentedUrl);
    }, []);

    // Helper functions for brain tumor image handling
    const getCurrentBrainTumorImage = () => {
        if (!isBrainTumor || !segmentedUrl) {
            return fileUrl || location.state?.fileUrl;
        }
        
        const images = [fileUrl || location.state?.fileUrl, segmentedUrl];
        return images[currentImageIndex];
    };

    const getCurrentBrainTumorImageLabel = () => {
        if (!isBrainTumor || !segmentedUrl) {
            return 'Medical Report';
        }
        
        const labels = ['Original Image', 'Segmented Image'];
        return labels[currentImageIndex];
    };

    const nextImage = () => {
        if (isBrainTumor && segmentedUrl) {
            setCurrentImageIndex((prev) => (prev + 1) % 2);
        }
    };

    const prevImage = () => {
        if (isBrainTumor && segmentedUrl) {
            setCurrentImageIndex((prev) => (prev - 1 + 2) % 2);
        }
    };

    const isImage = (url: string) => {
        if (!url) return false;
        const imageExtensions = /\.(jpeg|jpg|png|gif|bmp|webp)$/i;
        return imageExtensions.test(url) || url.startsWith('data:image/') || url.startsWith('blob:');
    };

    const handleSaveReport = async () => {
        setLoading(true);
        setReportSaved(false);
        setGeneratedReport('');
        try {
            const response = await fetch('http://localhost:5001/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ doctorReport }),
            });
            const data = await response.json();
            if (data.generatedReport) {
                setGeneratedReport(data.generatedReport);
                setRecommendations(data.summaryPoints || []);
                setReportSaved(true);
                setTimeout(() => setReportSaved(false), 2000);
                console.log('Upload successful:', data);
            } else {
                alert('Failed to generate report');
            }
        } catch (error) {
            alert('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {

        console.log(patientProfile);
        const doc = new jsPDF();
        const logo = new Image();
        logo.src = `${window.location.origin}/Logo.png`;

        try {
            await new Promise((resolve, reject) => {
                logo.onload = resolve;
                logo.onerror = reject;
            });

            doc.addImage(logo, 'PNG', 14, 10, 30, 30);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Algnosis Medical Center', 105, 18, { align: 'center' });
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Phone: +1 (800) 555-0123 | Email: info@algnosis.com', 105, 31, { align: 'center' });

            doc.setLineWidth(0.5);
            doc.line(14, 36, 196, 36);

            let y = 42;

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Patient Information', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Name: ${patientProfile.firstName || ''} ${patientProfile.lastName || ''}`, 14, y);
            doc.text(`Age: ${patientProfile.age || ''}`, 105, y);
            y += 6;
            doc.text(`Gender: ${patientProfile.gender || ''}`, 14, y);
            doc.text(`Email: ${patientProfile.email || ''}`, 105, y);
            y += 6;
            doc.text(`Phone: ${patientProfile.phoneNumber || ''}`, 14, y);
            doc.text(`Allergies: ${patientProfile.allergies || ''}`, 105, y);
            y += 6;
            doc.text(`Medications: ${patientProfile.currentMedications || ''}`, 14, y);
            doc.text(`Medical Devices: ${patientProfile.medicalDevices || ''}`, 105, y);
            y += 6;
            doc.text(`Restrictions: ${patientProfile.restrictions || ''}`, 14, y);
            doc.text(`Recent Surgery: ${patientProfile.recentSurgery || ''}`, 105, y);
            y += 6;
            doc.text(`Primary Contact: ${patientProfile.primaryContactName || ''} (${patientProfile.primaryContactPhone || ''})`, 14, y);
            doc.text(`Secondary Contact: ${patientProfile.secondaryContactName || ''} (${patientProfile.secondaryContactPhone || ''})`, 105, y);
            y += 12;

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnosis', 14, y);
            y += 9;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`${editableDiagnosis}`, 14, y);

           y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Notes", 14, y);
            y += 9;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            // Clean up and process the generated report
            let reportText = generatedReport || 'No report generated.';
            
            // Remove any redundant "Here is the rewritten medical report and" text
            reportText = reportText.replace(/^Here is the rewritten medical report and\s*/i, '');
            
            // Split the report into notes and recommendations sections
            let notesText = '';
            let recommendationsText = '';
            
            if (reportText.toLowerCase().includes('recommendations:')) {
                const parts = reportText.split(/recommendations:/i);
                notesText = parts[0].trim();
                recommendationsText = parts.slice(1).join('Recommendations:').trim();
                
                // Remove duplicate "Recommendations:" from the recommendations text
                recommendationsText = recommendationsText.replace(/^recommendations:\s*/i, '');
            } else {
                notesText = reportText;
            }
            
            // Clean up notes text - remove any trailing "Recommendations:" 
            notesText = notesText.replace(/\s*recommendations:\s*$/i, '').trim();

            // Print doctor's notes (main content)
            if (notesText) {
                const reportLines = doc.splitTextToSize(notesText, 180);
                doc.text(reportLines, 14, y);
                y += reportLines.length * 6 + 8;
            }

            // Print Recommendations section if present
            if (recommendationsText) {
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text('Recommendations', 14, y);
                y += 8;
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                // Format recommendations nicely
                const recLines = doc.splitTextToSize(recommendationsText, 180);
                doc.text(recLines, 14, y);
                y += recLines.length * 6 + 4;
            }

            y += recommendations.length * 6 + 10;
            const date = new Date().toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Generated on: ${date}`, 14, 290);
            doc.text(`Page 1`, 190, 290, { align: 'right' });

            doc.save(`Medical_Report_${patientProfile.firstName.replace(/\s/g, '_')}.pdf`);

        } catch (err) {
            console.error('Error during PDF generation or upload:', err);
            alert('An error occurred during report generation or upload.');
        }
    };

    const handleSaveDiagnosis = () => {
        setSavingDiagnosis(true);
        try {
            // Update the result object with new diagnosis
            if (result) {
                result.diagnosis = editableDiagnosis;
            }
            setIsEditingDiagnosis(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Error updating diagnosis:', error);
            alert('Failed to update diagnosis');
        } finally {
            setSavingDiagnosis(false);
        }
    };

    const handleUploadPDF = async () => {
        const doc = new jsPDF();
        const logo = new Image();
        logo.src = `${window.location.origin}/Logo.png`;

        try {
            await new Promise((resolve, reject) => {
                logo.onload = resolve;
                logo.onerror = reject;
            });

            doc.addImage(logo, 'PNG', 14, 10, 30, 30);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Algnosis Medical Center', 105, 18, { align: 'center' });
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text('Phone: +1 (800) 555-0123 | Email: info@algnosis.com', 105, 31, { align: 'center' });

            doc.setLineWidth(0.5);
            doc.line(14, 36, 196, 36);

            let y = 42;

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Patient Information', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`Name: ${patientProfile.firstName || ''} ${patientProfile.lastName || ''}`, 14, y);
            doc.text(`Age: ${patientProfile.age || ''}`, 105, y);
            y += 6;
            doc.text(`Gender: ${patientProfile.gender || ''}`, 14, y);
            doc.text(`Email: ${patientProfile.email || ''}`, 105, y);
            y += 6;
            doc.text(`Phone: ${patientProfile.phoneNumber || ''}`, 14, y);
            doc.text(`Allergies: ${patientProfile.allergies || ''}`, 105, y);
            y += 6;
            doc.text(`Medications: ${patientProfile.currentMedications || ''}`, 14, y);
            doc.text(`Medical Devices: ${patientProfile.medicalDevices || ''}`, 105, y);
            y += 6;
            doc.text(`Restrictions: ${patientProfile.restrictions || ''}`, 14, y);
            doc.text(`Recent Surgery: ${patientProfile.recentSurgery || ''}`, 105, y);
            y += 6;
            doc.text(`Primary Contact: ${patientProfile.primaryContactName || ''} (${patientProfile.primaryContactPhone || ''})`, 14, y);
            doc.text(`Secondary Contact: ${patientProfile.secondaryContactName || ''} (${patientProfile.secondaryContactPhone || ''})`, 105, y);
            y += 12;
         
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnosis', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`${editableDiagnosis}`, 14, y);

           y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Notes", 14, y);
            y += 9;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');

            // Clean up and process the generated report
            let reportText = generatedReport || 'No report generated.';
            
            // Remove any redundant "Here is the rewritten medical report and" text
            reportText = reportText.replace(/^Here is the rewritten medical report and\s*/i, '');
            
            // Split the report into notes and recommendations sections
            let notesText = '';
            let recommendationsText = '';
            
            if (reportText.toLowerCase().includes('recommendations:')) {
                const parts = reportText.split(/recommendations:/i);
                notesText = parts[0].trim();
                recommendationsText = parts.slice(1).join('Recommendations:').trim();
                
                // Remove duplicate "Recommendations:" from the recommendations text
                recommendationsText = recommendationsText.replace(/^recommendations:\s*/i, '');
            } else {
                notesText = reportText;
            }
            
            // Clean up notes text - remove any trailing "Recommendations:" 
            notesText = notesText.replace(/\s*recommendations:\s*$/i, '').trim();

            // Print doctor's notes (main content)
            if (notesText) {
                const reportLines = doc.splitTextToSize(notesText, 180);
                doc.text(reportLines, 14, y);
                y += reportLines.length * 6 + 8;
            }

            // Print Recommendations section if present
            if (recommendationsText) {
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text('Recommendations', 14, y);
                y += 8;
                doc.setFontSize(11);
                doc.setFont('helvetica', 'normal');
                
                // Format recommendations nicely
                const recLines = doc.splitTextToSize(recommendationsText, 180);
                doc.text(recLines, 14, y);
                y += recLines.length * 6 + 4;
            }

            y += recommendations.length * 6 + 10;
            const date = new Date().toLocaleDateString();
            doc.setFontSize(10);
            doc.text(`Generated on: ${date}`, 14, 290);
            doc.text(`Page 1`, 190, 290, { align: 'right' });

        } catch (err) {
            console.error('Error during PDF generation or upload:', err);
            alert('An error occurred during report generation or upload.');
            return;
        }

        try {
            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob);
            formData.append('reportId', reportID);
            formData.append('diagnosis', editableDiagnosis); // Add diagnosis
            formData.append('diagnosisSummary', recommendations.length > 0 ? recommendations.join('\n') : 'No recommendations available.'); // Add diagnosis summary with recommendations

            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8020/reports/diagnosis/update', {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Upload successful:', data);
                setPdfSubmitted(true);
                setShowToast(true);
            } else {
                const errorData = await res.json();
                console.error('Upload failed:', res.status, errorData);
                alert('Report upload failed');
            }
        } catch (err) {
            console.error('Error during PDF upload:', err);
            alert('An error occurred during report upload.');
        }
    };

    // Add a min-h-[180px] (or adjust as needed) to both tiles for equal height
    const tileClasses = "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400";
    const headerClasses = "text-xl font-semibold text-blue-800 mb-4 border-b pb-2 border-blue-200";
    const textBoldClasses = "font-semibold text-blue-900";
    const textNormalClasses = "font-normal text-gray-700";
    const equalHeightTile = `${tileClasses} border-blue-600 min-h-[180px] flex flex-col justify-between`;

    return (
        <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
            <DoctorNavBar />
            {showToast && (
                <Toast
                    message="Diagnosis updated successfully!"
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="flex-1 w-full max-w-7xl mx-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-900">Diagnosis Result for {patientProfile.firstName}</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Back
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column: Diagnosis + Doctor's Report + Generated Report */}
                    <div className="flex flex-col gap-8">
                        {/* Diagnosis Tile - equal height */}
                        <div className={`${tileClasses} border-blue-600 min-h-[220px] flex flex-col justify-between flex-1`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className={headerClasses}>Diagnosis</h2>
                                {!isEditingDiagnosis ? (
                                    <button
                                        onClick={() => setIsEditingDiagnosis(true)}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveDiagnosis}
                                            disabled={savingDiagnosis}
                                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                                        >
                                            {savingDiagnosis ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditingDiagnosis(false);
                                                setEditableDiagnosis(result?.diagnosis || '');
                                            }}
                                            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                                {isEditingDiagnosis ? (
                                    <textarea
                                        value={editableDiagnosis}
                                        onChange={(e) => setEditableDiagnosis(e.target.value)}
                                        className="w-full h-32 p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-center text-lg font-semibold text-blue-800"
                                        placeholder="Enter diagnosis..."
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-blue-800 text-center">{editableDiagnosis}</span>
                                )}
                            </div>
                        </div>

                        {/* Doctor's Report Tile */}
                        <div className={`${tileClasses} border-blue-600`}>
                            <h2 className={headerClasses}>Doctor's Report</h2>
                            <textarea
                                className="w-full min-h-[180px] rounded-lg border border-blue-200 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors bg-blue-50 text-gray-800"
                                placeholder="Write your diagnosis, notes, or recommendations here..."
                                value={doctorReport}
                                onChange={e => setDoctorReport(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSaveReport}
                                disabled={loading || !doctorReport.trim()}
                            >
                                {loading ? 'Generating...' : 'Generate & Save Report'}
                            </button>
                            {reportSaved && <div className="mt-4 text-green-600 font-semibold text-center">Report saved!</div>}
                        </div>
                    </div>

                    {/* Right Column: Patient Profile + Report Preview */}
                    <div className="flex flex-col gap-8">
                        {/* Patient Profile Tile - equal height */}
                        {/* <div className={equalHeightTile}>
                            <h2 className={headerClasses}>Patient Profile</h2>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                                <div><span className={textBoldClasses}>Name:</span> <span className={textNormalClasses}>{patientProfile.firstName} {patientProfile.lastName}</span></div>
                                <div><span className={textBoldClasses}>Age:</span> <span className={textNormalClasses}>{patientProfile.age}</span></div>
                                <div><span className={textBoldClasses}>Gender:</span> <span className={textNormalClasses}>{patientProfile.gender}</span></div>
                                <div><span className={textBoldClasses}>Allergies:</span> <span className={textNormalClasses}>{patientProfile.allergies}</span></div>
                                <div><span className={textBoldClasses}>Restrictions:</span> <span className={textNormalClasses}>{patientProfile.restrictions}</span></div>
                                <div><span className={textBoldClasses}>Medications:</span> <span className={textNormalClasses}>{patientProfile.currentMedications}</span></div>
                                <div><span className={textBoldClasses}>Primary Contact:</span> <span className={textNormalClasses}>{patientProfile.primaryContactName} ({patientProfile.primaryContactPhone})</span></div>
                                <div><span className={textBoldClasses}>Recent Surgery:</span> <span className={textNormalClasses}>{patientProfile.recentSurgery}</span></div>
                            </div>
                        </div> */}

                        {/* Report Preview Tile - Fixed height to match left column */}
                        <div className={`${tileClasses} border-blue-600 flex-1 flex flex-col`}>
                            <h2 className={headerClasses}>Report Preview</h2>
                            <div className="flex-1 flex flex-col justify-center items-center min-h-[450px]">
                            {getCurrentBrainTumorImage() ? (
                                isImage(getCurrentBrainTumorImage()) ? (
                                    // Check if this is a brain tumor case with both images
                                    (isBrainTumor && segmentedUrl && fileUrl) ? (
                                        <div className="w-full relative">
                                            {/* Image Label */}
                                            <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                                                {getCurrentBrainTumorImageLabel()}
                                            </h3>
                                            
                                            {/* Current Image */}
                                            <div className="relative">
                                                <img
                                                    src={getCurrentBrainTumorImage()}
                                                    alt={getCurrentBrainTumorImageLabel()}
                                                    className="object-contain max-h-[400px] w-full rounded-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.01]"
                                                    onError={(e) => {
                                                        console.error('Image failed to load:', getCurrentBrainTumorImage());
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                                
                                                {/* Navigation Arrows */}
                                                <button
                                                    onClick={prevImage}
                                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                                                    aria-label="Previous image"
                                                >
                                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                
                                                <button
                                                    onClick={nextImage}
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                                                    aria-label="Next image"
                                                >
                                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                                
                                                {/* Image Counter */}
                                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">
                                                    {currentImageIndex + 1} / 2
                                                </div>
                                            </div>
                                            
                                            {/* Debug Info */}
                                            <div className="mt-2 text-xs text-gray-500 text-center">
                                                Showing: {getCurrentBrainTumorImageLabel()}
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={getCurrentBrainTumorImage()}
                                            alt="Report/X-ray"
                                            className="object-contain max-h-[400px] w-full rounded-lg border border-gray-200"
                                            onError={(e) => {
                                                console.error('Image failed to load:', getCurrentBrainTumorImage());
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )
                                ) : (
                                    <a
                                        href={getCurrentBrainTumorImage()}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-center block"
                                    >
                                        View Report File
                                    </a>
                                )
                            ) : (
                                <div className="text-gray-500 text-center p-8">No report file available.</div>
                            )}
                            </div>
                        </div>
                    </div>
                    {/* Generated Report & Recommendations Tile */}
                    <div className="lg:col-span-2 col-span-1">
                    <div className={`${tileClasses} border-blue-600 w-full`}>
                        <h2 className={headerClasses}>Generated Report</h2>
                        {generatedReport ? (
                            <>
                                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-gray-800 whitespace-pre-line mb-4 text-sm">
                                    {generatedReport}
                                </div>
                                {/* <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                                    {recommendations.map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul> */}
                                <button
                                    className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                                    onClick={handleDownloadPDF}
                                >
                                    Download PDF
                                </button>
                                <button
                                    className={`mt-6 w-full px-4 py-2 rounded-lg shadow-md transition-colors ${pdfSubmitted ? 'bg-green-400 text-white' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                    onClick={handleUploadPDF}
                                    disabled={pdfSubmitted}
                                >
                                    {pdfSubmitted ? 'Submitted' : 'Submit PDF'}
                                </button>
                            </>
                        ) : (
                            <div className="text-gray-500 text-center p-8">Generated report will appear here after you save.</div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDiagnosisResult;