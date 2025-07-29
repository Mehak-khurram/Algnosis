import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorNavBar from '../../components/DoctorNavBar.tsx';

// Placeholder patient data
const patientProfile = {
    name: 'John Doe',
    age: 45,
    dob: '1979-01-01',
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '555-1234',
    address: '123 Main St, City',
    emergencyContact: 'Jane Doe (Wife) - 555-5678',
    insurance: 'HealthPlus',
    allergies: 'Penicillin',
    conditions: 'Asthma',
};
const patientHistory = [
    { date: '2024-05-01', type: 'X-ray', summary: 'Normal' },
    { date: '2024-03-15', type: 'Lab Report', summary: 'Elevated WBC' },
];
const recentReports = [
    { date: '2024-05-01', type: 'X-ray', summary: 'Normal', file: 'https://via.placeholder.com/100x120?text=X-ray' },
    { date: '2024-03-15', type: 'Lab Report', summary: 'Elevated WBC', file: 'https://via.placeholder.com/100x120?text=Lab+Report' },
];

const DoctorDiagnosisResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result || { diagnosis: 'Pneumonia', confidence: 0.92 };
    const [doctorReport, setDoctorReport] = useState('');
    const [reportSaved, setReportSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [generatedReport, setGeneratedReport] = useState('');
    const [recommendations, setRecommendations] = useState<string[]>([]);

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

        logo.onload = async () => {
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
            doc.text(`Name: ${patientProfile.name}`, 14, y);
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
            doc.text(`${result.diagnosis}%)`, 14, y);

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

            doc.save(`Medical_Report_${patientProfile.name.replace(/\s/g, '_')}.pdf`);
            
            const pdfBlob = doc.output('blob');
            const formData = new FormData();
            formData.append('file', pdfBlob, 'Medical_Report.pdf');
            try {
        const res = await fetch('http://localhost:13000/upload-pdf', {
          method: 'POST',
          body: formData,
        });

        const cloudData = await res.json();
        if (res.ok) {
          console.log('Cloudinary PDF URL:', cloudData.url);
          alert(`PDF uploaded successfully!\nLink: ${cloudData.url}`);
        } else {
          throw new Error(cloudData.error || 'Upload failed');
        }
      } catch (err) {
        console.error('Upload failed:', err);
        alert('Cloudinary upload failed.');
      }

        };
    };
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-pink-50 flex flex-col">
            <DoctorNavBar />
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-7xl px-8 pt-8 pb-2">
                    <div className="text-2xl font-bold text-blue-900 animate-fadein-left z-10 text-left mb-4">
                        Diagnosis Result
                    </div>
                </div>
                <div className="grid grid-cols-6 grid-rows-4 gap-8 w-full max-w-7xl p-8">
                    {/* Diagnosis Result Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border-l-8 border-teal-400 animate-fadein">
                        <div className="text-2xl font-bold text-teal-700 mb-2">Diagnosis</div>
                        <div className="text-3xl font-bold text-blue-900 mb-4">{result.diagnosis}</div>
                    </div>
                    {/* Patient Profile Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-purple-400 animate-fadein">
                        <div className="text-xl font-bold text-purple-700 mb-2">Patient Profile</div>
                        <div className="text-blue-900 font-semibold">Name: <span className="font-normal text-gray-800">{patientProfile.name}</span></div>
                        <div className="text-blue-900 font-semibold">Age: <span className="font-normal text-gray-800">{patientProfile.age}</span></div>
                        <div className="text-blue-900 font-semibold">Date of Birth: <span className="font-normal text-gray-800">{patientProfile.dob}</span></div>
                        <div className="text-blue-900 font-semibold">Gender: <span className="font-normal text-gray-800">{patientProfile.gender}</span></div>
                        <div className="text-blue-900 font-semibold">Email: <span className="font-normal text-gray-800">{patientProfile.email}</span></div>
                        <div className="text-blue-900 font-semibold">Phone: <span className="font-normal text-gray-800">{patientProfile.phone}</span></div>
                        <div className="text-blue-900 font-semibold">Address: <span className="font-normal text-gray-800">{patientProfile.address}</span></div>
                        <div className="text-blue-900 font-semibold">Emergency Contact: <span className="font-normal text-gray-800">{patientProfile.emergencyContact}</span></div>
                        <div className="text-blue-900 font-semibold">Insurance: <span className="font-normal text-gray-800">{patientProfile.insurance}</span></div>
                        <div className="text-blue-900 font-semibold">Allergies: <span className="font-normal text-gray-800">{patientProfile.allergies}</span></div>
                        <div className="text-blue-900 font-semibold">Medical Conditions: <span className="font-normal text-gray-800">{patientProfile.conditions}</span></div>
                    </div>
                    {/* Patient History Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-pink-400 animate-fadein">
                        <div className="text-xl font-bold text-pink-700 mb-2">Patient History</div>
                        {patientHistory.length > 0 ? (
                            <ul className="w-full">
                                {patientHistory.map((h, idx) => (
                                    <li key={idx} className="mb-2 p-2 bg-pink-50 rounded-lg">
                                        <span className="font-semibold text-blue-900">{h.date}</span> - <span className="text-gray-700">{h.type}</span>: <span className="text-gray-800">{h.summary}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No previous reports.</div>
                        )}
                    </div>
                    {/* Recent Reports Tile */}
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-blue-400 animate-fadein">
                        <div className="text-xl font-bold text-blue-700 mb-2">Recent Reports</div>
                        {recentReports.length > 0 ? (
                            <ul className="w-full flex flex-col gap-2">
                                {recentReports.map((r, idx) => (
                                    <li key={idx} className="flex items-center gap-4 bg-blue-50 rounded-lg p-2">
                                        <img src={r.file} alt={r.type} className="w-12 h-16 object-cover rounded shadow" />
                                        <div>
                                            <div className="font-semibold text-blue-900">{r.type}</div>
                                            <div className="text-gray-700 text-sm">{r.date} - {r.summary}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-gray-500">No recent reports.</div>
                        )}
                    </div>
                    {/* Doctor's Report Tile */}
                    <div className="col-span-3 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-green-400 animate-fadein">
                        <div className="text-xl font-bold text-green-700 mb-2">Doctor's Report</div>
                        <textarea
                            className="w-full min-h-[100px] rounded-lg border border-gray-300 p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                            placeholder="Write your diagnosis, notes, or recommendations here..."
                            value={doctorReport}
                            onChange={e => setDoctorReport(e.target.value)}
                            disabled={loading}
                        />
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                            onClick={handleSaveReport}
                            disabled={loading || !doctorReport.trim()}
                        >
                            {loading ? 'Generating...' : 'Generate & Save Report'}
                        </button>
                        {reportSaved && <div className="mt-2 text-green-700 font-semibold">Report saved!</div>}
                        {generatedReport && (
                            <div className="mt-4 w-full">
                                <div className="font-semibold text-green-800 mb-1">Generated Report:</div>
                                <div className="bg-green-50 border border-green-200 rounded p-3 whitespace-pre-line text-gray-900 text-sm">{generatedReport}</div>
                                <button
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleDownloadPDF}
                                >
                                    Download PDF
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Recommendations Tile */}
                    <div className="col-span-3 row-span-2 bg-white rounded-2xl shadow-xl flex flex-col items-start justify-center p-8 border-l-8 border-orange-400 animate-fadein">
                        <div className="text-xl font-bold text-orange-700 mb-2">Next Steps / Recommendations</div>
                        <ul className="list-disc pl-6">
                            {recommendations.map((rec, idx) => (
                                <li key={idx} className="mb-2 text-gray-800">{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Back</button>
            </div>
            <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein {
          animation: fadein 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadein-left {
          from { opacity: 0; transform: translateX(-32px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadein-left {
          animation: fadein-left 1s cubic-bezier(.4,0,.2,1) both;
        }
      `}</style>
        </div>
    );
};

export default DoctorDiagnosisResult;