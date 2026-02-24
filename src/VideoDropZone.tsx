import { useState, DragEvent, ReactElement, KeyboardEvent } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

interface Props {
    onVideoLoaded: (url: string) => void;
}

function filePathToUrl(filePath: string): string {
    const normalized = filePath.replace(/\\/g, '/');
    return normalized.startsWith('/') ? `file://${normalized}` : `file:///${normalized}`;
}

const VideoDropZone = ({ onVideoLoaded }: Props): ReactElement => {
    const [isDragging, setIsDragging] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            const filePath = (file as File & { path?: string }).path;
            if (filePath) {
                onVideoLoaded(filePathToUrl(filePath));
            }
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleBrowse = async () => {
        const filePath = await window.electronAPI.openVideoFile();
        if (filePath) {
            onVideoLoaded(filePathToUrl(filePath));
        }
    };

    const handleUrlLoad = () => {
        const url = urlInput.trim();
        if (url) {
            onVideoLoaded(url);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleUrlLoad();
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: '24px',
            padding: '40px',
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa'
        }}>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onClick={handleBrowse}
                style={{
                    width: '100%',
                    maxWidth: '520px',
                    border: `3px dashed ${isDragging ? '#0d6efd' : '#adb5bd'}`,
                    borderRadius: '12px',
                    padding: '56px 32px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragging ? '#e8f0fe' : '#ffffff',
                    transition: 'all 0.2s ease',
                    userSelect: 'none'
                }}
            >
                <i
                    className="pi pi-video"
                    style={{
                        fontSize: '3.5rem',
                        color: isDragging ? '#0d6efd' : '#6c757d',
                        display: 'block',
                        marginBottom: '16px'
                    }}
                />
                <p style={{ margin: 0, fontSize: '1.15rem', color: '#343a40', fontWeight: 500 }}>
                    Drop video file here
                </p>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#6c757d' }}>
                    or click to browse
                </p>
                <p style={{ margin: '14px 0 0', fontSize: '0.8rem', color: '#adb5bd' }}>
                    Supports MP4, AVI, MKV, MOV, WebM, OGV and more
                </p>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                maxWidth: '520px',
                gap: '16px'
            }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #dee2e6', margin: 0 }} />
                <span style={{ color: '#6c757d', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>or enter online URL</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #dee2e6', margin: 0 }} />
            </div>

            <div style={{ display: 'flex', width: '100%', maxWidth: '520px', gap: '8px' }}>
                <InputText
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://example.com/video.mp4"
                    style={{ flex: 1 }}
                />
                <Button
                    label="Load"
                    onClick={handleUrlLoad}
                    disabled={!urlInput.trim()}
                />
            </div>
        </div>
    );
};

export default VideoDropZone;
