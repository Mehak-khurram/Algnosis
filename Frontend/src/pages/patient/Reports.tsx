import React from "react"
import { useState } from "react"
import { Upload, FileText, Brain, TreesIcon as Lungs, Droplets, Clock, CheckCircle } from "lucide-react"
// Removed all custom UI component imports

interface UploadedFile {
    id: string
    name: string
    type: string
    size: string
    uploadDate: string
}

interface PastReport {
    id: string
    type: string
    diagnosis: string
    date: string
    status: "completed" | "pending" | "in-review"
    doctor: string
    files: number
}

export default function Reports() {
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile[]>>({
        xray: [],
        mri: [],
        blood: [],
    })

    const pastReports: PastReport[] = [
        {
            id: "1",
            type: "X-Ray",
            diagnosis: "Pneumonia Screening",
            date: "2024-01-15",
            status: "completed",
            doctor: "Dr. Sarah Johnson",
            files: 2,
        },
        {
            id: "2",
            type: "MRI",
            diagnosis: "Brain Tumor Detection",
            date: "2024-01-10",
            status: "in-review",
            doctor: "Dr. Sarah Johnson",
            files: 3,
        },
        {
            id: "3",
            type: "Blood Report",
            diagnosis: "Anemia Detection",
            date: "2024-01-05",
            status: "completed",
            doctor: "Dr. Sarah Johnson",
            files: 1,
        },
    ]

    const handleFileUpload = (type: string, files: FileList | null) => {
        if (!files) return

        const newFiles: UploadedFile[] = Array.from(files).map((file, index) => ({
            id: `${type}-${Date.now()}-${index}`,
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            uploadDate: new Date().toISOString().split("T")[0],
        }))

        setUploadedFiles((prev) => ({
            ...prev,
            [type]: [...prev[type], ...newFiles],
        }))
    }

    const UploadArea = ({
        type,
        title,
        description,
        icon: Icon,
        acceptedTypes,
        color,
    }: {
        type: string
        title: string
        description: string
        icon: any
        acceptedTypes: string
        color: string
    }) => (
        <div className="rounded-xl shadow border bg-white">
            <div className="text-center p-6">
                <div className={`mx-auto w-12 h-12 ${color} rounded-full flex items-center justify-center mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-blue-900 font-semibold">{title}</h3>
                <p className="text-blue-600 text-sm">{description}</p>
            </div>
            <div className="p-6 border-t border-blue-200">
                <div
                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 transition-colors cursor-pointer"
                    onDrop={(e) => {
                        e.preventDefault()
                        handleFileUpload(type, e.dataTransfer.files)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => {
                        const input = document.createElement("input")
                        input.type = "file"
                        input.multiple = true
                        input.accept = acceptedTypes
                        input.onchange = (e) => {
                            const target = e.target as HTMLInputElement
                            handleFileUpload(type, target.files)
                        }
                        input.click()
                    }}
                >
                    <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-700 font-medium">Click to upload or drag and drop</p>
                    <p className="text-blue-500 text-sm mt-1">Accepted formats: {acceptedTypes}</p>
                </div>

                {uploadedFiles[type].length > 0 && (
                    <div className="mt-4 space-y-2">
                        <h4 className="font-medium text-blue-900">Uploaded Files:</h4>
                        {uploadedFiles[type].map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm text-blue-800">{file.name}</span>
                                </div>
                                <span className="text-xs text-blue-600">{file.size}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "in-review":
                return "bg-blue-100 text-blue-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="w-4 h-4" />
            case "pending":
                return <Clock className="w-4 h-4" />
            case "in-review":
                return <FileText className="w-4 h-4" />
            default:
                return <FileText className="w-4 h-4" />
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-900 mb-2">Medical Imaging Portal</h1>
                    <p className="text-blue-600 text-lg">Upload your medical reports for AI-powered diagnosis</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-3 gap-2">
                        <button className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Upload Reports
                        </button>
                        <button className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Past Reports
                        </button>
                        <button className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            Our Doctors
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <UploadArea
                            type="xray"
                            title="X-Ray Upload"
                            description="For Pneumonia & TB Detection"
                            icon={Lungs}
                            acceptedTypes=".jpg,.jpeg,.png,.dcm"
                            color="bg-blue-600"
                        />

                        <UploadArea
                            type="mri"
                            title="MRI Upload"
                            description="For Brain Tumor Detection"
                            icon={Brain}
                            acceptedTypes=".jpg,.jpeg,.png,.dcm,.nii"
                            color="bg-blue-700"
                        />

                        <UploadArea
                            type="blood"
                            title="Blood Report Upload"
                            description="CBC for Anemia Detection"
                            icon={Droplets}
                            acceptedTypes=".pdf,.jpg,.jpeg,.png"
                            color="bg-blue-800"
                        />
                    </div>

                    <div className="bg-blue-50 border-blue-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900">Ready to Submit?</h3>
                                <p className="text-blue-700">
                                    Your reports will be analyzed by our AI system and verified by Dr. Sarah Johnson.
                                </p>
                            </div>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Submit for Analysis</button>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="bg-white border-blue-200 rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Medical History</h3>
                        <p className="text-blue-600 text-sm mb-4">Track your submitted reports and their analysis status</p>
                        <div className="space-y-4">
                            {pastReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="flex items-center justify-between p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            {report.type === "X-Ray" && <Lungs className="w-5 h-5 text-blue-600" />}
                                            {report.type === "MRI" && <Brain className="w-5 h-5 text-blue-600" />}
                                            {report.type === "Blood Report" && <Droplets className="w-5 h-5 text-blue-600" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-blue-900">{report.diagnosis}</h4>
                                            <p className="text-sm text-blue-600">
                                                {report.type} • {report.files} file(s) • {report.date}
                                            </p>
                                            <p className="text-sm text-blue-500">Reviewed by {report.doctor}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`${getStatusColor(report.status)} inline-flex items-center px-2 py-1 rounded text-xs font-medium`}>
                                            {getStatusIcon(report.status)}
                                            <span className="capitalize">{report.status.replace("-", " ")}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <div className="flex justify-center">
                        <div className="border-blue-200 rounded-lg shadow max-w-md w-full">
                            <div className="text-center p-6">
                                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="bg-blue-600 text-white text-xl">SJ</span>
                                </div>
                                <h3 className="text-blue-900 text-xl font-semibold">Dr. Sarah Johnson</h3>
                                <p className="text-blue-600 text-base">Chief Medical Officer</p>
                            </div>
                            <div className="p-6 border-t border-blue-200 text-center space-y-4">
                                <p className="text-blue-700">
                                    Board-certified physician with expertise in radiology, hematology, and diagnostic medicine. Dr.
                                    Johnson oversees all medical report verifications with 20+ years of clinical experience.
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 inline-flex items-center px-2 py-1 rounded text-xs font-medium">X-Ray Analysis</span>
                                    <span className="bg-blue-100 text-blue-800 inline-flex items-center px-2 py-1 rounded text-xs font-medium">MRI Analysis</span>
                                    <span className="bg-blue-100 text-blue-800 inline-flex items-center px-2 py-1 rounded text-xs font-medium">Blood Analysis</span>
                                </div>
                                <div className="pt-4 border-t border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2">Credentials</h4>
                                    <ul className="text-sm text-blue-700 space-y-1">
                                        <li>• MD from Harvard Medical School</li>
                                        <li>• Board Certified in Internal Medicine</li>
                                        <li>• Fellowship in Diagnostic Radiology</li>
                                        <li>• 20+ years clinical experience</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border-blue-200 rounded-lg p-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">Report Verification Process</h3>
                            <p className="text-blue-700">
                                All uploaded reports are first analyzed by our AI system and then personally reviewed and verified
                                by Dr. Johnson to ensure accurate diagnosis and comprehensive medical recommendations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 