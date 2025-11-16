import React, { useState } from 'react';

interface UploadPageProps {
    onUploadComplete: () => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadComplete }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
            alert('Please upload a CSV or Excel file');
            return;
        }

        setFileName(file.name);
        setIsUploading(true);

        // Simulate upload delay (demo)
        setTimeout(() => {
            setIsUploading(false);
            // After upload, show the main page
            setTimeout(() => {
                onUploadComplete();
            }, 800);
        }, 2000);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
            backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                padding: '3rem',
                textAlign: 'center'
            }}>
                {/* Header */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#166534',
                    marginBottom: '0.5rem'
                }}>
                    Clim.io
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#6b7280',
                    marginBottom: '2rem'
                }}>
                    Upload your portfolio data to get started
                </p>

                {/* Upload Area */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    style={{
                        border: isDragging ? '2px solid #16a34a' : '2px dashed #d1d5db',
                        borderRadius: '0.75rem',
                        padding: '3rem 2rem',
                        backgroundColor: isDragging ? '#f0fdf4' : '#fafafa',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        marginBottom: '2rem'
                    }}
                >
                    <input
                        type="file"
                        id="csvUpload"
                        onChange={handleFileChange}
                        accept=".csv,.xlsx,.xls"
                        style={{ display: 'none' }}
                        disabled={isUploading}
                    />
                    <label htmlFor="csvUpload" style={{ cursor: 'pointer' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {isUploading ? '⏳' : '📁'}
                        </div>
                        <div style={{
                            fontSize: '1.25rem',
                            fontWeight: '600',
                            color: '#166534',
                            marginBottom: '0.5rem'
                        }}>
                            {isUploading ? 'Uploading...' : 'Drag and drop your file here'}
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: '#6b7280'
                        }}>
                            or click to browse
                        </div>
                    </label>
                </div>

                {/* File Info */}
                {fileName && (
                    <div style={{
                        padding: '1rem',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '0.5rem',
                        marginBottom: '2rem',
                        borderLeft: '4px solid #16a34a'
                    }}>
                        <p style={{
                            color: '#166534',
                            fontWeight: '600',
                            marginBottom: '0.25rem'
                        }}>
                            ✓ File selected:
                        </p>
                        <p style={{
                            color: '#4b5563',
                            fontSize: '0.875rem'
                        }}>
                            {fileName}
                        </p>
                    </div>
                )}

                {/* Progress */}
                {isUploading && (
                    <div style={{
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            width: '100%',
                            height: '8px',
                            backgroundColor: '#e5e7eb',
                            borderRadius: '4px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                backgroundColor: '#16a34a',
                                animation: 'progress 1s infinite',
                                width: '30%'
                            }} />
                        </div>
                        <p style={{
                            marginTop: '0.75rem',
                            color: '#6b7280',
                            fontSize: '0.875rem'
                        }}>
                            Processing your portfolio data...
                        </p>
                    </div>
                )}

                {/* Upload Button */}
                <label htmlFor="csvUpload">
                    <div
                        style={{
                            display: 'inline-block',
                            padding: '0.75rem 2rem',
                            backgroundColor: isUploading ? '#9ca3af' : '#16a34a',
                            color: 'white',
                            borderRadius: '0.5rem',
                            cursor: isUploading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            transition: 'all 0.3s',
                            opacity: isUploading ? 0.7 : 1
                        }}
                    >
                        {isUploading ? '⏳ Uploading...' : '📤 Select CSV File'}
                    </div>
                </label>

                {/* Supported Formats */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '0.5rem'
                }}>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        marginBottom: '0.5rem',
                        fontWeight: '600'
                    }}>
                        Supported formats:
                    </p>
                    <p style={{
                        fontSize: '0.875rem',
                        color: '#6b7280'
                    }}>
                        CSV, XLSX, XLS
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes progress {
                    0% { width: 0; }
                    50% { width: 100%; }
                    100% { width: 0; }
                }
            `}</style>
        </div>
    );
};

export default UploadPage;
