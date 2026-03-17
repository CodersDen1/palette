
import React from 'react';
import { AnalyzedItem } from '../types';

interface BOQTableProps {
  items: AnalyzedItem[];
  isOpen: boolean;
  onClose: () => void;
  originalImage?: string | null;
}

export const BOQTable: React.FC<BOQTableProps> = ({ items, isOpen, onClose, originalImage }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 backdrop-blur-sm flex items-center justify-center p-4 md:p-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-full flex flex-col overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Bill of Quantities (BOQ)</h2>
            <p className="text-sm text-slate-500">Estimated requirements with Dubai vendor matches</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-xs uppercase tracking-wider text-slate-600 font-semibold">
                <th className="p-4 border-b border-slate-200 w-24">Visual</th>
                <th className="p-4 border-b border-slate-200">Item Description</th>
                <th className="p-4 border-b border-slate-200">Category</th>
                <th className="p-4 border-b border-slate-200">Material / Spec</th>
                <th className="p-4 border-b border-slate-200 text-right">Est. Qty</th>
                <th className="p-4 border-b border-slate-200">Preferred Dubai Vendor</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700">
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-4 border-b border-slate-100">
                     {originalImage && (
                        <div 
                            className="w-16 h-16 rounded border border-slate-200 overflow-hidden"
                            style={{
                                backgroundImage: `url(${originalImage})`,
                                backgroundSize: '600%',
                                backgroundPosition: `${item.x}% ${item.y}%`,
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                     )}
                  </td>
                  <td className="p-4 border-b border-slate-100 font-medium">{item.name}</td>
                  <td className="p-4 border-b border-slate-100">
                    <span className="px-2 py-1 rounded-full bg-white border border-slate-200 text-xs text-slate-500">{item.category}</span>
                  </td>
                  <td className="p-4 border-b border-slate-100 text-slate-500">{item.material}</td>
                  <td className="p-4 border-b border-slate-100 text-right font-mono">{item.quantityEstimate}</td>
                  <td className="p-4 border-b border-slate-100">
                    <div className="text-blue-600 font-bold">{item.vendors?.[0]?.name || "TBD"}</div>
                    <div className="text-[10px] text-slate-400">{item.vendors?.[0]?.location}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
             <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Export CSV for Dubai Suppliers
             </button>
        </div>
      </div>
    </div>
  );
};
