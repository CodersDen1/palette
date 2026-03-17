
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-black font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* Background Architectural Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="h-full w-full max-w-[1600px] mx-auto grid grid-cols-4 md:grid-cols-12 opacity-[0.03]">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-black h-full"></div>
          ))}
        </div>
        <div className="absolute inset-0 flex flex-col opacity-[0.03]">
           {[...Array(10)].map((_, i) => (
            <div key={i} className="border-b border-black w-full flex-1"></div>
          ))}
        </div>
      </div>

      <div className={`relative z-10 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Editorial Navigation */}
        <header className="fixed top-0 left-0 right-0 z-[100] px-8 py-8 md:px-16 md:py-12 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto">
            <h1 className="text-[14px] font-black tracking-[0.6em] uppercase leading-none">Palette</h1>
          </div>
          <div className="pointer-events-auto flex flex-col items-end gap-1">
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Global Procurement Hub</span>
            <span className="text-[9px] font-mono text-black font-bold uppercase tracking-widest">DXB / UAE</span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center px-8 md:px-24">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex flex-col mb-16">
              <span className="text-[10px] font-mono font-black uppercase tracking-[0.6em] mb-6 text-zinc-300">Intelligent Interior Engine</span>
              <h2 className="text-[13vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase mb-0">
                Interior<br/>
                <span className="ml-[2vw] md:ml-[4vw]">Procured.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-4">
                <p className="text-xs md:text-sm leading-relaxed text-zinc-500 font-medium uppercase tracking-tight max-w-xs">
                  A neural architecture protocol for mapping finishes and matching global supply chains to local markets.
                </p>
              </div>
              <div className="md:col-start-9 md:col-span-4">
                <button 
                  onClick={onStart}
                  className="w-full bg-black text-white py-8 md:py-10 text-[12px] font-black tracking-[0.8em] uppercase hover:bg-zinc-800 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.15)] active:scale-[0.98] group relative overflow-hidden"
                >
                  <span className="relative z-10">Start Experience →</span>
                  <div className="absolute inset-0 bg-zinc-900 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Narrative Block 01 */}
        <section className="grid grid-cols-1 md:grid-cols-2 border-t border-zinc-100">
          <div className="aspect-square bg-zinc-100 overflow-hidden relative group" onClick={onStart}>
             <img 
               src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
               className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105 cursor-pointer" 
               alt="Aesthetic Interior"
             />
             <div className="absolute bottom-12 left-12">
               <span className="text-[9px] font-mono text-white bg-black px-2 py-1 uppercase tracking-widest">Case_01</span>
             </div>
          </div>
          <div className="p-12 md:p-24 flex flex-col justify-center bg-white">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-300 mb-8">Concept</span>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-10">
              Pixels to<br/>Purchase Order.
            </h3>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-md uppercase tracking-tight font-medium">
              Palette analyzes spatial geometry to extract materials, surface finishes, and furniture data—cross-referencing them against active inventories in the Dubai design district.
            </p>
            <div className="mt-12">
               <button onClick={onStart} className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-black pb-2 hover:opacity-50 transition-opacity">Launch Intelligence</button>
            </div>
          </div>
        </section>

        {/* Partner Ecosystem */}
        <section className="px-8 md:px-24 py-32 bg-zinc-50 border-y border-zinc-100">
          <header className="flex justify-between items-end mb-16">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Local Distribution Network</span>
            <span className="text-[8px] font-mono text-zinc-200">ACTIVE_API_CONNECTIONS</span>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-24 grayscale opacity-40 hover:opacity-80 transition-all duration-700">
             <div className="text-xl md:text-2xl font-black uppercase tracking-tighter">Bagno Design</div>
             <div className="text-xl md:text-2xl font-black uppercase tracking-tighter">Sanipex Group</div>
             <div className="text-xl md:text-2xl font-black uppercase tracking-tighter">Al Huzaifa</div>
             <div className="text-xl md:text-2xl font-black uppercase tracking-tighter">Obegi Home</div>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="px-8 md:px-24 py-24 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6">
            <h4 className="text-2xl font-black uppercase tracking-tighter">Palette.</h4>
            <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest leading-loose">
              © 2025 Studio Procurement.<br/>
              Dubai Design District, UAE.
            </p>
          </div>
          <div className="flex gap-16">
             <div className="flex flex-col gap-4">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">Social</span>
               <ul className="text-[10px] uppercase tracking-widest space-y-2">
                 <li><a href="#" className="hover:opacity-50">Instagram</a></li>
                 <li><a href="#" className="hover:opacity-50">LinkedIn</a></li>
               </ul>
             </div>
             <div className="flex flex-col gap-4">
               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-300">Access</span>
               <button onClick={onStart} className="text-[10px] uppercase tracking-widest hover:opacity-50 text-left">Request API</button>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
