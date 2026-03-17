import React, { useState, useEffect, useRef } from 'react';

interface ReferencePaletteProps {
  references: [string | null, string | null];
  onSelect: (index: 0 | 1, base64: string | null) => void;
  onTriggerEdit?: (index: 0 | 1) => void;
}

export const ReferencePalette: React.FC<ReferencePaletteProps> = ({ references, onSelect, onTriggerEdit }) => {
  // Initialize position roughly at bottom center
  const [position, setPosition] = useState({ 
      x: typeof window !== 'undefined' ? window.innerWidth / 2 - 140 : 0, 
      y: typeof window !== 'undefined' ? window.innerHeight - 160 : 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const processFile = (file: File, index: 0 | 1) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelect(index, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent, index: 0 | 1) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file, index);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: 0 | 1) => {
    const file = e.target.files?.[0];
    if (file) processFile(file, index);
  };

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event from reaching canvas
    
    // Don't trigger drag if clicking inputs or buttons
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) {
        return;
    }
    
    setIsDragging(true);
    dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        setPosition({
            x: e.clientX - dragOffset.current.x,
            y: e.clientY - dragOffset.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
        onMouseDown={handleMouseDown}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        className="fixed z-40 flex flex-col gap-2 p-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-fade-in-up cursor-grab active:cursor-grabbing select-none"
    >
      {/* Drag Handle */}
      <div className="w-full flex justify-center pb-1">
          <div className="w-12 h-1 bg-slate-200 rounded-full"></div>
      </div>

      <div className="flex gap-4">
        {references.map((refImg, idx) => {
            const index = idx as 0 | 1;
            return (
            <div
                key={index}
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-all group bg-white overflow-hidden shadow-sm"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => !refImg && document.getElementById(`palette-ref-${index}`)?.click()}
            >
                <input
                id={`palette-ref-${index}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, index)}
                />

                {refImg ? (
                <>
                    <img 
                    src={refImg} 
                    alt={`Ref ${index + 1}`} 
                    className="w-full h-full object-cover pointer-events-none" 
                    />
                    
                    {/* Delete Button */}
                    <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelect(index, null);
                    }}
                    className="absolute top-2 right-2 bg-white/90 text-slate-700 rounded-full p-1 shadow-sm hover:text-red-600 transition-colors z-10 backdrop-blur-sm cursor-pointer"
                    title="Remove Reference"
                    onMouseDown={(e) => e.stopPropagation()} 
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    </button>

                    {/* Magic Swap Trigger Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if(onTriggerEdit) onTriggerEdit(index);
                        }}
                        className="pointer-events-auto bg-white text-black rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-blue-50 transition-transform transform hover:scale-105 flex items-center gap-1 cursor-pointer"
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        Swap
                    </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 bg-white/90 p-1.5 text-center backdrop-blur-sm border-t border-slate-100">
                        <span className="text-[9px] font-bold text-slate-900 uppercase tracking-widest block">Ref {index + 1}</span>
                    </div>
                </>
                ) : (
                <div className="flex flex-col items-center gap-1 text-slate-400 group-hover:text-blue-500">
                    <span className="text-2xl font-light">+</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Add Item</span>
                </div>
                )}
            </div>
            );
        })}
      </div>
    </div>
  );
};