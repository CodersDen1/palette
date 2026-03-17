
import React, { useState, useEffect, useRef } from 'react';

interface ImageEditorProps {
  isOpen: boolean;
  currentImage: string | null;
  onClose: () => void;
  onSubmit: (prompt: string, referenceImage?: string | null) => void;
  isProcessing: boolean;
  referenceImages?: [string | null, string | null];
  initialReferenceIndex?: number | null;
  onReferenceUpload?: (index: 0 | 1, base64: string | null) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ 
    isOpen, 
    currentImage,
    onClose, 
    onSubmit, 
    isProcessing, 
    referenceImages = [null, null],
    initialReferenceIndex = null,
    onReferenceUpload
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedRefIndex, setSelectedRefIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSlotIndex = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen && initialReferenceIndex !== null) {
        setSelectedRefIndex(initialReferenceIndex);
    } else if (isOpen) {
        if (referenceImages[0]) setSelectedRefIndex(0);
        else if (referenceImages[1]) setSelectedRefIndex(1);
    }
  }, [isOpen, initialReferenceIndex, referenceImages]);

  if (!isOpen) return null;

  const handleSlotClick = (idx: number) => {
    if (referenceImages[idx]) {
        setSelectedRefIndex(idx);
    } else {
        currentSlotIndex.current = idx;
        fileInputRef.current?.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onReferenceUpload && currentSlotIndex.current !== null) {
        const reader = new FileReader();
        const indexToUpdate = currentSlotIndex.current as 0 | 1;
        reader.onload = (event) => {
            if (event.target?.result) {
                onReferenceUpload(indexToUpdate, event.target.result as string);
                setSelectedRefIndex(indexToUpdate);
                currentSlotIndex.current = null;
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleRemoveReference = (e: React.MouseEvent, idx: 0 | 1) => {
    e.stopPropagation();
    if (onReferenceUpload) {
        onReferenceUpload(idx, null);
        if (selectedRefIndex === idx) setSelectedRefIndex(null);
    }
  };

  const currentRef = selectedRefIndex !== null ? referenceImages[selectedRefIndex] : null;

  return (
    <div className="fixed inset-0 bg-white/40 backdrop-blur-3xl z-[150] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
      <div className="bg-white border border-black shadow-[0_120px_240px_rgba(0,0,0,0.4)] w-full max-w-7xl flex flex-col md:flex-row h-auto max-h-[95vh] overflow-hidden">
        
        {/* Left Side: SOURCE RENDER - ULTRA MINIMAL OVERLAYS */}
        <div className="w-full md:w-3/5 bg-zinc-100 flex flex-col border-r border-black overflow-hidden group relative">
            <header className="absolute top-6 left-6 z-20 flex flex-col gap-1">
                <span className="text-[8px] font-mono font-black text-white bg-black px-1.5 py-0.5 uppercase tracking-[0.4em]">01_WORKSPACE</span>
                <span className="text-[7px] font-mono text-black/30 uppercase tracking-[0.4em] ml-1">RENDER_ACTIVE</span>
            </header>
            
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative">
                {currentImage ? (
                    <img 
                        src={currentImage} 
                        className="max-w-full max-h-full object-contain shadow-2xl border border-black/10 transition-transform duration-700 group-hover:scale-[1.01]" 
                        alt="Current Canvas Design"
                    />
                ) : (
                    <div className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">No Base Image Available</div>
                )}
            </div>

            {/* MINIMIZED VIEWPORT NOTE */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
                <div className="w-1 h-1 bg-black animate-ping"></div>
                <span className="text-[8px] font-mono font-black text-black/40 uppercase tracking-[0.5em]">Targeting_Viewport_Pro</span>
            </div>
            
            <div className="absolute top-6 right-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[8px] font-mono text-black/10 uppercase tracking-widest">DXB_NEURAL_PRO_V3</span>
            </div>
        </div>

        {/* Right Side: MODIFICATION CONSOLE */}
        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col bg-white overflow-y-auto">
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-mono font-black text-white bg-black px-2 py-0.5 uppercase tracking-widest">NANO PRO ENGINE</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Magic Swap<br/>Studio</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 transition-colors border border-transparent hover:border-black/5 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </header>

            <div className="space-y-10">
                {/* Reference Slots */}
                <div className="space-y-4">
                    <header className="flex justify-between items-center">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Spec Swatch Library</label>
                    </header>
                    <div className="grid grid-cols-2 gap-4">
                        {referenceImages.map((img, idx) => (
                            <div 
                                key={idx}
                                onClick={() => handleSlotClick(idx)}
                                className={`
                                    relative aspect-square border-[2px] transition-all cursor-pointer group flex flex-col items-center justify-center overflow-hidden
                                    ${selectedRefIndex === idx ? 'border-black bg-white ring-4 ring-black/5' : 'border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white'}
                                `}
                            >
                                {img ? (
                                    <>
                                        <img src={img} className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-transform" />
                                        <button 
                                            onClick={(e) => handleRemoveReference(e, idx as 0 | 1)}
                                            className="absolute top-2 right-2 bg-black text-white p-2 hover:bg-zinc-700 transition-colors shadow-lg"
                                        >
                                            <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-[0.4em] p-1.5 text-center">
                                            SLOT_{idx + 1}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-zinc-300 group-hover:text-black">
                                        <span className="text-xl font-light">+</span>
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">UPLOAD_SWATCH</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prompt Entry */}
                <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Modification Instructions</label>
                    <textarea
                        className="w-full h-44 bg-zinc-50 border border-black/10 p-6 text-[13px] font-medium focus:outline-none focus:border-black transition-colors resize-none uppercase tracking-tight placeholder:text-zinc-300 placeholder:italic leading-relaxed"
                        placeholder="Replace the kitchen island countertop with the marble from Slot 1."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isProcessing}
                    />
                </div>

                <div className="pt-2 space-y-4">
                    <button 
                        onClick={() => onSubmit(prompt, currentRef)}
                        disabled={isProcessing || !prompt.trim()}
                        className={`
                            w-full py-6 text-[11px] font-black uppercase tracking-[0.6em] transition-all border border-black relative overflow-hidden
                            ${isProcessing || !prompt.trim() 
                                ? 'bg-zinc-100 text-zinc-300 border-zinc-200 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-zinc-900 shadow-2xl active:scale-[0.99]'}
                        `}
                    >
                        {isProcessing ? 'RECONSTRUCTING...' : 'EXECUTE_SWAP'}
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-2 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300 hover:text-black transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
        </div>

      </div>
    </div>
  );
};
