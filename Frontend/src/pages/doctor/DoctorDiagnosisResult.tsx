import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

const patientHistory = [
    { date: '2024-05-01', type: 'X-ray', summary: 'Normal' },
    { date: '2024-03-15', type: 'Lab Report', summary: 'Elevated WBC' },
];

const recentReports = [
    { date: '2024-05-01', type: 'X-ray', summary: 'Normal', file: 'https://via.placeholder.com/100x120?text=X-ray' },
    { date: '2024-03-15', type: 'Lab Report', summary: 'Elevated WBC', file: 'https://via.placeholder.com/100x120?text=Lab+Report' },
];

const DoctorDiagnosisResult: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { result, profile, reportID } = location.state || {};
    const patientProfile = profile || {};

    const [doctorReport, setDoctorReport] = useState('');
    const [reportSaved, setReportSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedReport, setGeneratedReport] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [pdfSubmitted, setPdfSubmitted] = useState(false);

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
            doc.text(`Name: ${patientProfile.firstName}`, 14, y);
            doc.text(`Age: ${patientProfile.age}`, 105, y);
            y += 6;
            doc.text(`DOB: ${patientProfile.dob}`, 14, y);
            doc.text(`Gender: ${patientProfile.gender}`, 105, y);
            y += 6;
            doc.text(`Email: ${patientProfile.email}`, 14, y);
            doc.text(`Phone: ${patientProfile.phone}`, 105, y);
            y += 6;
            doc.text(`Address: ${patientProfile.address}`, 14, y);
            y += 6;
            doc.text(`Emergency Contact: ${patientProfile.emergencyContact}`, 14, y);
            y += 6;
            doc.text(`Insurance: ${patientProfile.insurance}`, 14, y);
            y += 6;
            doc.text(`Allergies: ${patientProfile.allergies}`, 14, y);
            doc.text(`Conditions: ${patientProfile.conditions}`, 105, y);

            y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnosis', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`${result.diagnosis}`, 14, y);

            y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Notes", 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const reportLines = doc.splitTextToSize(generatedReport || 'No report generated.', 180);
            doc.text(reportLines, 14, y);
            y += reportLines.length * 6 + 4;

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Recommendations', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            recommendations.forEach((rec, idx) => {
                doc.text(`• ${rec}`, 18, y + idx * 6);
            });

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
            doc.text(`Name: ${patientProfile.firstName}`, 14, y);
            doc.text(`Age: ${patientProfile.age}`, 105, y);
            y += 6;
            doc.text(`DOB: ${patientProfile.dob}`, 14, y);
            doc.text(`Gender: ${patientProfile.gender}`, 105, y);
            y += 6;
            doc.text(`Email: ${patientProfile.email}`, 14, y);
            doc.text(`Phone: ${patientProfile.phone}`, 105, y);
            y += 6;
            doc.text(`Address: ${patientProfile.address}`, 14, y);
            y += 6;
            doc.text(`Emergency Contact: ${patientProfile.emergencyContact}`, 14, y);
            y += 6;
            doc.text(`Insurance: ${patientProfile.insurance}`, 14, y);
            y += 6;
            doc.text(`Allergies: ${patientProfile.allergies}`, 14, y);
            doc.text(`Conditions: ${patientProfile.conditions}`, 105, y);

            y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Diagnosis', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`${result.diagnosis}`, 14, y);

            y += 12;
            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text("Doctor's Notes", 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const reportLines = doc.splitTextToSize(generatedReport || 'No report generated.', 180);
            doc.text(reportLines, 14, y);
            y += reportLines.length * 6 + 4;

            doc.setFontSize(13);
            doc.setFont('helvetica', 'bold');
            doc.text('Recommendations', 14, y);
            y += 8;
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            recommendations.forEach((rec, idx) => {
                doc.text(`• ${rec}`, 18, y + idx * 6);
            });

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
            formData.append('diagnosis', result.diagnosis); // Add diagnosis
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

    const isImage = (url: string) => {
        return (/\.(jpg|jpeg|png|gif|bmp|webp)$/i).test(url);
    };

    const tileClasses = "bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-400";
    const headerClasses = "text-xl font-semibold text-blue-800 mb-4 border-b pb-2 border-blue-200";
    const textBoldClasses = "font-semibold text-blue-900";
    const textNormalClasses = "font-normal text-gray-700";

    console.log('Location State:', location.state); // Debugging the navigation state

    return (
        <div className="min-h-screen bg-blue-50 flex flex-col">
            <DoctorNavBar />
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Diagnosis Result Tile */}
                    <div className={`${tileClasses} border-blue-600`}>
                        <h2 className={headerClasses}>Diagnosis</h2>
                        <div className="text-3xl font-bold text-blue-800 text-center">{result.diagnosis}</div>
                    </div>

                    {/* Patient Profile Tile */}
                    <div className={`${tileClasses} col-span-1 md:col-span-2`}>
                        <h2 className={headerClasses}>Patient Profile</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6 text-sm">
                            <div><span className={textBoldClasses}>Name:</span> <span className={textNormalClasses}>{patientProfile.firstName} {patientProfile.lastName}</span></div>
                            <div><span className={textBoldClasses}>Age:</span> <span className={textNormalClasses}>{patientProfile.age}</span></div>
                            <div><span className={textBoldClasses}>Gender:</span> <span className={textNormalClasses}>{patientProfile.gender}</span></div>
                            <div><span className={textBoldClasses}>Allergies:</span> <span className={textNormalClasses}>{patientProfile.allergies}</span></div>
                            <div><span className={textBoldClasses}>Restrictions:</span> <span className={textNormalClasses}>{patientProfile.restrictions}</span></div>
                            <div><span className={textBoldClasses}>Medications:</span> <span className={textNormalClasses}>{patientProfile.currentMedications}</span></div>
                            <div><span className={textBoldClasses}>Primary Contact:</span> <span className={textNormalClasses}>{patientProfile.primaryContactName} ({patientProfile.primaryContactPhone})</span></div>
                            <div><span className={textBoldClasses}>Recent Surgery:</span> <span className={textNormalClasses}>{patientProfile.recentSurgery}</span></div>
                        </div>
                    </div>

                    {/* Patient History Tile */}
                    <div className={tileClasses}>
                        <h2 className={headerClasses}>Patient History</h2>
                        {patientHistory.length > 0 ? (
                            <ul className="space-y-3">
                                {patientHistory.map((h, idx) => (
                                    <li key={idx} className="p-3 bg-blue-50 rounded-lg border-l-2 border-blue-300">
                                        <div className="text-sm">
                                            <span className={textBoldClasses}>{h.date}</span> - <span className={textNormalClasses}>{h.type}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 mt-1">{h.summary}</div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500 text-center">No previous history.</div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Doctor's Report Tile */}
                    <div className={`${tileClasses} col-span-1 md:col-span-1 border-blue-600`}>
                        <h2 className={headerClasses}>Doctor's Report</h2>
                        <textarea
                            className="w-full min-h-[120px] rounded-lg border border-blue-200 p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors bg-blue-50 text-gray-800"
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

                    {/* Generated Report & Recommendations Tile */}
                    <div className={`${tileClasses} col-span-1 md:col-span-1 border-blue-600`}>
                        <h2 className={headerClasses}>Generated Report</h2>
                        {generatedReport ? (
                            <>
                                <div className="bg-blue-50 border border-blue-200 rounded p-4 text-gray-800 whitespace-pre-line mb-4 text-sm">
                                    {generatedReport}
                                </div>
                                <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
                                    {recommendations.map((rec, idx) => (
                                        <li key={idx}>{rec}</li>
                                    ))}
                                </ul>
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

                    {/* Report Preview Tile */}
                    <div className={`${tileClasses} col-span-1 md:col-span-2`}>
                        <h2 className={headerClasses}>Report Preview</h2>
                        {location.state?.fileUrl ? (
                            isImage(location.state.fileUrl) ? (
                                <img
                                    src={location.state.fileUrl}
                                    alt="Report/X-ray"
                                    className="object-contain max-h-[500px] w-full rounded-lg border border-gray-200"
                                />
                            ) : (
                                <a
                                    href={location.state.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-center block mt-4"
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
        </div>
    );
};

export default DoctorDiagnosisResult;