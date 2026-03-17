
import React from 'react';
import { AnalyzedItem } from '../types';

interface SearchIndexProps {
  items: AnalyzedItem[];
  onSelect: (id: string) => void;
  isAnalyzing: boolean;
}

export const SearchIndex: React.FC<SearchIndexProps> = ({ items, onSelect, isAnalyzing }) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-10 py-12 border-b border-zinc-100 shrink-0">
        <div className="flex justify-between items-end mb-4">
            <span className="text-[9px] font-mono font-black text-black/30 uppercase tracking-[0.4em]">Index_Feed_02</span>
            <span className="text-[9px] font-mono text-black font-bold uppercase tracking-widest">{items.length} ITEMS DETECTED</span>
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Search<br/>Results.</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
        {items.length === 0 && !isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">No Data Mapped</span>
            </div>
        )}

        {items.map((item, idx) => (
            <div 
                key={item.id} 
                onClick={() => onSelect(item.id)}
                className="group cursor-pointer border-b border-zinc-50 pb-8 hover:border-black transition-all duration-500"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono font-black text-zinc-300">0{idx + 1}</span>
                        <div className={`w-2 h-2 rounded-full ${item.isUpdating ? 'bg-zinc-200 animate-pulse' : 'bg-black'}`}></div>
                        <h3 className="text-lg font-black uppercase tracking-tight group-hover:translate-x-1 transition-transform">{item.name}</h3>
                    </div>
                    {item.averagePrice !== 'AED_CALCULATING' && (
                        <span className="text-[10px] font-mono font-bold text-zinc-400">{item.averagePrice}</span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-50 text-zinc-400 border border-zinc-100">{item.category}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-50 text-zinc-400 border border-zinc-100">{item.material || 'ANALYZING...'}</span>
                </div>

                {/* Grounding Links List */}
                {item.groundingSources && item.groundingSources.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <span className="text-[8px] font-mono font-bold text-zinc-300 uppercase tracking-widest block mb-1">Marketplace_Links</span>
                        {item.groundingSources.slice(0, 2).map((source, sIdx) => (
                            <div key={sIdx} className="flex items-center justify-between group/link">
                                <span className="text-[9px] font-medium text-zinc-500 uppercase tracking-tight truncate max-w-[200px]">{source.title}</span>
                                <span className="text-[10px] opacity-0 group-hover/link:opacity-100 group-hover:translate-x-1 transition-all">→</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
      </div>

      <footer className="p-10 border-t border-zinc-100 bg-zinc-50/50">
        <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-relaxed">
            Automatic scene analysis based on Google Search grounding and neural mapping. Verify all materials prior to procurement.
        </p>
      </footer>
    </div>
  );
};
