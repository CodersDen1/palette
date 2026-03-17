
import React from 'react';
import { AnalyzedItem } from '../types';

interface ProductCardProps {
  item: AnalyzedItem;
  onClose: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onClose }) => {
  // Encode search query for URLs
  const encodedQuery = encodeURIComponent(item.searchQuery || item.name);
  // Use Pollinations AI for a generated reference image based on the description
  const refImageUrl = `https://image.pollinations.ai/prompt/${encodedQuery}?width=400&height=300&nologo=true`;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-fade-in-up">
      
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 backdrop-blur-md z-10 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Reference Image Header */}
      <div className="h-40 bg-slate-200 relative overflow-hidden">
        <img 
            src={refImageUrl} 
            alt="AI Reference" 
            className="w-full h-full object-cover"
            loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded mb-1">
                {item.category}
            </span>
            <h2 className="text-lg font-bold text-white leading-tight">{item.name}</h2>
        </div>
      </div>

      <div className="p-5 max-h-[60vh] overflow-y-auto">
        
        {/* Material Info */}
        <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1 uppercase tracking-wide font-semibold">
                <span>Material</span>
                <span>Est. Qty</span>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-800">
                <span>{item.material}</span>
                <span>{item.quantityEstimate}</span>
            </div>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                {item.description}
            </p>
        </div>

        {/* Local Vendors */}
        <div className="mb-4">
             <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Local Dubai Vendors
             </h3>
             <div className="space-y-2">
                {(item.vendors || []).map((vendor, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">{vendor.name}</h4>
                                <p className="text-[10px] text-slate-500">{vendor.location}</p>
                            </div>
                            <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{vendor.priceEstimate}</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] py-1.5 rounded border border-slate-200 transition-colors">
                                Call {vendor.phone}
                            </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* External Link Action */}
        <a 
            href={`https://www.google.com/search?q=${encodedQuery}&tbm=shop`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-medium shadow-lg shadow-blue-200 transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Find Similar Online
        </a>

      </div>
    </div>
  );
};
