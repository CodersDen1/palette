
import React, { useState } from 'react';
import { AnalyzedItem } from '../types';

interface ItemDetailsProps {
  item: AnalyzedItem | null;
  onClose: () => void;
  originalImage?: string | null;
}

const VariationImage: React.FC<{ brand: string; name: string; index: number }> = ({ brand, name, index }) => {
  const [failed, setFailed] = useState(false);
  const src = `https://image.pollinations.ai/prompt/${encodeURIComponent(brand + " " + name + " high end product shot strictly monochrome studio lighting minimalist architectural luxury")}?width=400&height=500&nologo=true&seed=${index}`;

  if (failed) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 p-4">
        <div className="text-[32px] mb-3 opacity-20">◎</div>
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300 text-center leading-relaxed">{brand}</span>
        <span className="text-[10px] font-black uppercase tracking-tight text-zinc-500 text-center mt-1">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
      alt={name}
      onError={() => setFailed(true)}
    />
  );
};

export const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onClose, originalImage }) => {
  if (!item) return null;

  if (item.isUpdating) {
      return (
        <div className="h-full flex flex-col bg-white p-12 space-y-12">
            <div className="h-80 bg-zinc-50 animate-pulse border border-zinc-100"></div>
            <div className="space-y-6">
                <div className="h-10 bg-zinc-50 rounded w-1/2 animate-pulse"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-zinc-50 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-zinc-50 rounded w-3/4 animate-pulse"></div>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden border-l border-zinc-200 shadow-[-40px_0_80px_rgba(0,0,0,0.05)]">
      
      {/* Header Visual Section */}
      <div className="relative h-[340px] shrink-0 border-b border-zinc-200 group overflow-hidden bg-zinc-100">
         {originalImage && (
            <div 
                className="w-full h-full transition-transform duration-1000 group-hover:scale-110"
                style={{
                    backgroundImage: `url(${originalImage})`,
                    backgroundSize: '450%',
                    backgroundPosition: `${item.x}% ${item.y}%`,
                    backgroundRepeat: 'no-repeat'
                }}
            />
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
         
         <button 
            onClick={onClose} 
            className="absolute top-8 right-8 bg-white text-black p-3 hover:bg-black hover:text-white transition-all shadow-2xl z-20 border border-white/10"
         >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
         </button>

         <div className="absolute bottom-10 left-10 right-10 z-10 text-white">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/70">PROCUREMENT_DOSSIER_v1</span>
            </div>
            <h2 className="text-5xl font-black leading-none tracking-tighter uppercase mb-6 drop-shadow-2xl">{item.name}</h2>
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-widest text-white/70">
                <span className="bg-white/10 px-3 py-1.5 border border-white/20 text-white font-bold">{item.category.toUpperCase()}</span>
                <span className="text-white">EST_PRICE: {item.averagePrice}</span>
            </div>
         </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto p-12 space-y-16 custom-scrollbar bg-white">
        
        {/* Marketplace - Capped at 3 */}
        {item.groundingSources && item.groundingSources.length > 0 && (
            <section>
                <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Acquisition Links</h3>
                    <span className="text-[9px] font-mono text-zinc-300">GROUNDING_DATA</span>
                </header>
                <div className="space-y-3">
                    {item.groundingSources.slice(0, 3).map((source, idx) => (
                        <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            className="flex items-center justify-between p-6 border border-zinc-100 hover:border-black hover:bg-zinc-50 transition-all group shadow-sm hover:shadow-md"
                        >
                            <span className="text-[11px] font-bold uppercase tracking-wider truncate mr-6">{source.title}</span>
                            <span className="text-[12px] font-black group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    ))}
                </div>
            </section>
        )}

        {/* Technical Specifications */}
        <section>
             <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-6">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Material Specs</h3>
             </header>
             <div className="font-mono text-[12px] leading-relaxed text-zinc-600 mb-8 p-8 bg-zinc-50 border-l-4 border-black uppercase tracking-tight shadow-sm italic">
                "{item.description}"
             </div>
             <div className="grid grid-cols-2 gap-px bg-zinc-100 border border-zinc-100 shadow-inner">
                <div className="bg-white p-8">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">Primary Finish</span>
                    <span className="text-[13px] font-black text-black uppercase tracking-tighter">{item.material}</span>
                </div>
                <div className="bg-white p-8">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-3">BOQ_EST_QUANTITY</span>
                    <span className="text-[13px] font-black text-black uppercase tracking-tighter">{item.quantityEstimate}</span>
                </div>
             </div>
        </section>

        {/* Dubai Partners - LIST OF VENDORS */}
        <section className="bg-zinc-950 text-white p-10 -mx-12">
             <header className="flex justify-between items-end border-b border-white/20 pb-4 mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">SUPPLIER_DATABASE</span>
                    <h3 className="text-[12px] font-black uppercase tracking-[0.5em]">Dubai Procurement Hub</h3>
                </div>
                <span className="text-[10px] font-mono text-white/40 font-bold">LOC: DXB_UAE</span>
             </header>
             <div className="space-y-6">
                {item.vendors.length > 0 ? (
                    item.vendors.map((v, i) => (
                        <div key={i} className="group p-6 border border-white/10 hover:border-white/40 transition-all flex justify-between items-center bg-white/5">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                                    <h4 className="font-black text-[15px] uppercase tracking-tighter leading-none">{v.name}</h4>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">{v.location}</p>
                                    <div className="h-3 w-px bg-white/10"></div>
                                    <p className="text-[10px] text-white/50 font-mono uppercase tracking-widest">{v.phone || '+971_CALL'}</p>
                                </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-3">
                                <span className="text-[13px] font-black font-mono text-green-400">{v.priceEstimate}</span>
                                <button className="text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2.5 bg-white text-black hover:bg-zinc-200 transition-all shadow-xl">REQUEST_QUOTE</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-white/10 opacity-30">
                        <span className="text-[10px] font-mono uppercase tracking-widest">NO_VENDORS_MATCHED_AUTOMATICALLY</span>
                    </div>
                )}
             </div>
             
             <footer className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">VERIFIED_STOCKISTS_ONLY</span>
                <button className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-2">
                    Open Full Directory
                    <span className="text-lg">→</span>
                </button>
             </footer>
        </section>

        {/* Similar Visual Matches */}
        <section className="pb-12">
             <header className="flex justify-between items-end border-b-2 border-black pb-4 mb-10">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em]">Acquisition Variations</h3>
                <span className="text-[9px] font-mono text-zinc-300">V_04_MATCHES</span>
             </header>
             <div className="grid grid-cols-2 gap-10">
                {item.similarProducts?.map((p, i) => (
                    <div key={i} className="group cursor-pointer">
                        <div className="aspect-[4/5] bg-zinc-100 overflow-hidden mb-6 relative border border-zinc-100 shadow-sm">
                            <VariationImage brand={p.brand} name={p.name} index={i} />
                            <div className="absolute top-5 right-5 bg-black text-[9px] font-black text-white px-3 py-1.5 uppercase tracking-widest shadow-2xl border border-white/10">MATCH: {p.matchScore}</div>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-[11px] font-black uppercase tracking-tight truncate group-hover:translate-x-1 transition-transform">{p.name}</h4>
                            <p className="text-[9px] text-zinc-400 font-mono uppercase tracking-widest">{p.brand}</p>
                            <div className="pt-2 flex justify-between items-center">
                                <span className="text-[12px] font-black text-black">{p.price}</span>
                                <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">VIEW_SPEC</span>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </section>
      </div>
    </div>
  );
};
