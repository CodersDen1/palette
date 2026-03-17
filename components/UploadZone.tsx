
import React, { useState, useCallback } from 'react';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
    onImageSelected
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File, callback: (base64: string) => void) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, onImageSelected);
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0], onImageSelected);
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);

    const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Network error: ${response.status}`);
        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error('Not an image');
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                onImageSelected(event.target.result as string);
            }
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error("Image fetch error:", error);
        alert("Unable to load image link.");
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 animate-fade-in-up">
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
                w-full h-64 border-2 border-black border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group shadow-sm relative overflow-hidden bg-white
                ${isDragging ? 'bg-zinc-50 scale-105' : 'hover:bg-zinc-50'}
            `}
            onClick={() => document.getElementById('fileInput')?.click()}
        >
            <input
                id="fileInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
            />
            <div className="flex flex-col items-center gap-4 z-10">
                <div className="p-6 bg-black text-white group-hover:scale-110 transition-all shadow-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-[12px] font-black text-black uppercase tracking-[0.4em]">Upload Design Reference</h3>
                    <p className="text-zinc-400 text-[10px] font-mono mt-2 uppercase tracking-widest">Drop Image or Click to Browse</p>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 text-[9px] text-zinc-300 uppercase tracking-widest font-black">
            <div className="h-px bg-zinc-100 flex-1"></div>
            <span>IMPORT_METHOD_LINK</span>
            <div className="h-px bg-zinc-100 flex-1"></div>
        </div>

        {!showUrlInput ? (
             <button 
                onClick={() => setShowUrlInput(true)}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-5 font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-800 transition-all active:scale-[0.98]"
             >
                <span>External URI Import</span>
             </button>
        ) : (
            <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-fade-in">
                <input 
                    type="url" 
                    placeholder="PASTE_DIRECT_IMAGE_URI..." 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 border-2 border-black px-4 py-3 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:bg-zinc-50 bg-white"
                    autoFocus
                    disabled={isLoading}
                />
                <button 
                    type="submit"
                    disabled={isLoading || !url}
                    className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                >
                    {isLoading ? '...' : 'LOAD'}
                </button>
                <button 
                    type="button"
                    onClick={() => setShowUrlInput(false)}
                    className="p-3 text-zinc-400 hover:text-black"
                >
                    ✕
                </button>
            </form>
        )}
    </div>
  );
};
