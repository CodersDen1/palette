
import React, { useRef, useState, useEffect } from 'react';
import { AnalyzedItem } from '../types';

interface CanvasNodesProps {
  items: AnalyzedItem[];
  selectedItemId: string | null;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDragEnd: (id: string) => void;
}

export const CanvasNodes: React.FC<CanvasNodesProps> = ({ items, selectedItemId, onSelect, onMove, onDragEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingId && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        onMove(draggingId, Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)));
      }
    };

    const handleMouseUp = () => {
      if (draggingId) onDragEnd(draggingId);
      setDraggingId(null);
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, onDragEnd, onMove]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault(); 
    e.stopPropagation();
    onSelect(id);
    setDraggingId(id);
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-[300] overflow-visible pointer-events-none">
      {items.map((item, index) => {
        const isSelected = selectedItemId === item.id;
        const isDragging = draggingId === item.id;
        
        return (
          <div
            key={item.id}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${isDragging || isSelected ? 'z-[350]' : 'z-[310]'}`}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
          >
            <div className="relative flex items-center justify-center">
               
               {/* THE TRACKING DOTS */}
               <div className="relative flex items-center justify-center">
                  
                  {/* Active Ping Rings - More visible now */}
                  <span className={`absolute inline-flex h-14 w-14 rounded-full bg-black/10 opacity-75 animate-ping duration-[2s] ${isSelected ? 'scale-150' : ''}`}></span>
                  <span className={`absolute inline-flex h-10 w-10 rounded-full bg-black/20 opacity-90 animate-ping duration-[1.2s] ${isSelected ? 'scale-125' : ''}`}></span>
                  
                  <div className={`
                      relative rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] transition-all duration-500 flex items-center justify-center border border-white/60
                      ${isSelected 
                          ? 'w-10 h-10 bg-black scale-110 ring-4 ring-black/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]' 
                          : 'w-7 h-7 bg-black/90 group-hover:scale-110 group-hover:bg-black'}
                      ${item.isUpdating ? 'animate-pulse bg-zinc-600' : ''}
                  `}>
                      {item.isUpdating ? (
                           <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                          <span className="text-[10px] font-black text-white font-mono leading-none">
                              {String(index + 1).padStart(2, '0')}
                          </span>
                      )}
                  </div>

                  {/* Outer Glow for selection */}
                  {isSelected && (
                     <span className="absolute -inset-4 rounded-full border border-black/20 animate-pulse pointer-events-none"></span>
                  )}
               </div>

               {/* TAGS (Floating Labels) - Permanent when selected, hover otherwise */}
               <div className={`
                      absolute left-1/2 bottom-full mb-8 -translate-x-1/2 bg-black text-white text-[9px] font-medium py-2.5 px-5 whitespace-nowrap transition-all duration-500 ease-out transform pointer-events-none z-[400] border border-white/10 font-mono tracking-[0.2em] shadow-[0_20px_40px_rgba(0,0,0,0.4)]
                      ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-6'}
                  `}>
                      <div className="flex items-center gap-3">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.isUpdating ? 'bg-white/40 animate-pulse' : 'bg-white'}`}></span>
                          <div className="flex flex-col">
                              <span className="opacity-40 text-[7px] leading-none mb-1 uppercase tracking-[0.3em]">ITEM_{String(index + 1).padStart(2, '0')}</span>
                              <span className="uppercase font-black text-[10px] tracking-widest">{item.name}</span>
                          </div>
                      </div>
                      
                      {/* Connector Line */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-8 bg-black/40"></div>
                      
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
               </div>

               {/* Large Crosshair Guidelines - Only when selected and dragging */}
               {(isSelected || isDragging) && (
                   <>
                      <div className="absolute w-[3000px] h-px bg-black/[0.08] pointer-events-none -z-10 shadow-[0_0_10px_white]"></div>
                      <div className="absolute h-[3000px] w-px bg-black/[0.08] pointer-events-none -z-10 shadow-[0_0_10px_white]"></div>
                   </>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
