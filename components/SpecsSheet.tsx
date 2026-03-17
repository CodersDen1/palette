
import React, { useState } from 'react';
import { AnalyzedItem } from '../types';

interface SpecsSheetProps {
  items: AnalyzedItem[];
  isOpen: boolean;
  onClose: () => void;
  image?: string | null;
}

export const SpecsSheet: React.FC<SpecsSheetProps> = ({ items, isOpen, onClose, image }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-50 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-slate-100 w-full h-full max-w-7xl flex flex-col rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shrink-0 shadow-sm">
          <div className="flex items-center gap-4">
             {selectedIndex !== null && (
                 <button onClick={() => setSelectedIndex(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7" /></svg>
                 </button>
             )}
             <h2 className="text-xl font-bold text-slate-800">Dubai Specification Sheets</h2>
          </div>
          <div className="flex gap-3">
             <button onClick={() => window.print()} className="bg-black text-white px-5 py-2.5 text-sm font-bold uppercase rounded-lg">Print Specs</button>
             <button onClick={onClose} className="p-2.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-200/50">
            {selectedIndex === null ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item, idx) => (
                        <div 
                            key={item.id}
                            onClick={() => setSelectedIndex(idx)}
                            className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 overflow-hidden cursor-pointer"
                        >
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                                {image ? (
                                    <div 
                                        className="w-full h-full"
                                        style={{
                                            backgroundImage: `url(${image})`,
                                            backgroundSize: '400%',
                                            backgroundPosition: `${item.x}% ${item.y}%`,
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-200" />
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-800 text-sm">{item.name}</h3>
                                <p className="text-xs text-slate-500 mt-1">{item.vendors?.[0]?.name || 'Dubai Vendor'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center">
                     <SpecPage 
                        item={items[selectedIndex]} 
                        index={selectedIndex} 
                        date={currentDate} 
                        originalImage={image}
                    />
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface SpecPageProps {
    item: AnalyzedItem;
    index: number;
    date: string;
    originalImage?: string | null;
}

const SpecPage: React.FC<SpecPageProps> = ({ item, index, date, originalImage }) => {
  const vendor = item.vendors[0] || { name: 'Dubai Vendor', phone: '+971 4 000 0000', location: 'Dubai, UAE' };

  return (
    <div className="bg-white w-full max-w-[210mm] p-[15mm] shadow-xl text-[9pt] leading-snug font-sans text-black relative">
        <div className="flex justify-between items-start mb-8 border-b-4 border-black pb-4">
            <h1 className="text-4xl font-bold tracking-widest uppercase">Palette</h1>
            <div className="text-right text-[8pt]">
                <p>REF NO: PL-{item.id.substring(0,6).toUpperCase()}</p>
                <p>DATE: {date}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
                <div className="bg-black text-white px-2 py-1 uppercase text-xs font-bold">Item Specification</div>
                <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="font-bold">Name:</span> <span>{item.name}</span>
                    <span className="font-bold">Category:</span> <span>{item.category}</span>
                    <span className="font-bold">Material:</span> <span>{item.material}</span>
                    <span className="font-bold">Quantity:</span> <span>{item.quantityEstimate}</span>
                    <span className="font-bold">Dubai Price:</span> <span>{item.averagePrice || 'TBD'}</span>
                </div>
                <p className="text-xs italic text-slate-600 mt-4 border-l-2 border-slate-200 pl-4">{item.description}</p>
            </div>
            
            <div className="space-y-4">
                <div className="bg-black text-white px-2 py-1 uppercase text-xs font-bold">Visual Reference</div>
                <div className="aspect-[4/3] bg-slate-900 border border-slate-200 relative overflow-hidden">
                    {originalImage ? (
                        <div 
                            className="w-full h-full"
                            style={{
                                backgroundImage: `url(${originalImage})`,
                                backgroundSize: '400%',
                                backgroundPosition: `${item.x}% ${item.y}%`,
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100" />
                    )}
                </div>
            </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="font-bold uppercase tracking-widest text-xs mb-4">Preferred Dubai Supplier</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-bold">{vendor.name}</p>
                        <p className="text-slate-500 mt-1">{vendor.location}</p>
                    </div>
                    <div className="text-right">
                        <p>{vendor.phone}</p>
                        <p className="text-blue-600 underline">www.{vendor.name.toLowerCase().replace(/\s/g, '')}.ae</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="absolute bottom-8 right-8 text-[8pt] text-slate-400">Page {index + 1}</div>
    </div>
  );
}
