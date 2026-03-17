
import React from 'react';
import { AnalyzedItem } from '../types';

interface FabricsViewProps {
  items: AnalyzedItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const FabricsView: React.FC<FabricsViewProps> = ({ items, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Filter for Fabric items or items that contain fabric keywords in material
  const fabricItems = items.filter(i => 
    i.category === 'Fabric' || 
    (i.material && i.material.toLowerCase().match(/(fabric|textile|linen|velvet|cotton|silk|wool|boucle|leather)/))
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-50 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden animate-fade-in-up">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                Fabric Library
                <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{fabricItems.length} found</span>
            </h2>
            <p className="text-sm text-slate-500">Detected textiles and Dubai supplier recommendations</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {fabricItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No fabrics detected in this scene.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fabricItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                            <div className="flex h-32 border-b border-slate-100">
                                {/* AI Generated Texture Close-up */}
                                <div className="w-32 h-full relative shrink-0 bg-slate-200">
                                    <img 
                                        src={`https://image.pollinations.ai/prompt/${encodeURIComponent("texture close up fabric swatch " + item.material + " " + item.name)}?width=256&height=256&nologo=true&format=webp`}
                                        alt={item.name} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 shadow-inner pointer-events-none"></div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                                            {item.category}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 line-clamp-1">{item.name}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.material}</p>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-slate-50/30">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recommended Suppliers</h4>
                                <div className="space-y-3">
                                    {(item.vendors || []).map((vendor, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                            <div>
                                                <div className="text-xs font-bold text-slate-700">{vendor.name}</div>
                                                <div className="text-[10px] text-slate-400">{vendor.location}</div>
                                            </div>
                                            <button className="text-[10px] font-medium text-purple-600 hover:bg-purple-50 px-2 py-1 rounded border border-transparent hover:border-purple-100 transition-colors">
                                                Contact
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
