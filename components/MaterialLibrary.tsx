
import React, { useState } from 'react';

interface MaterialLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCanvas: (base64Image: string) => void;
}

const CATEGORIES = ['All', 'Textiles', 'Stone', 'Wood', 'Ceramics', 'Metals'];

const PREMIUM_BRANDS = [
  { name: 'KVADRAT', origin: 'DK', type: 'Textiles' },
  { name: 'MARAZZI', origin: 'IT', type: 'Ceramics' },
  { name: 'COSENTINO', origin: 'ES', type: 'Stone' },
  { name: 'MAHARAM', origin: 'US', type: 'Textiles' },
  { name: 'HAVWOODS', origin: 'UK', type: 'Wood' },
  { name: 'RIMADESIO', origin: 'IT', type: 'Metal' },
];

const MOCK_SWATCHES = [
    { id: 1, name: 'DIVINA MELANGE 3', brand: 'Kvadrat', category: 'Textiles', code: 'DM-001', prompt: 'felt wool fabric texture deep green swtach', price: 'AED 380/m' },
    { id: 2, name: 'CALACATTA VIOLA', brand: 'Natural Stone', category: 'Stone', code: 'ST-042', prompt: 'Calacatta Viola marble texture polished swatch', price: 'AED 1200/sqm' },
    { id: 3, name: 'OAK SELECT', brand: 'Havwoods', category: 'Wood', code: 'WD-103', prompt: 'light oak wood flooring texture seamless', price: 'AED 240/sqm' },
    { id: 4, name: 'TRAVERTINO', brand: 'Cosentino', category: 'Stone', code: 'ST-008', prompt: 'travertine stone texture beige porous', price: 'AED 450/sqm' },
    { id: 5, name: 'STEELCUT TRIO', brand: 'Kvadrat', category: 'Textiles', code: 'TX-550', prompt: 'woven wool fabric texture mustard yellow detailed', price: 'AED 420/m' },
    { id: 6, name: 'CEPPO DI GRE', brand: 'Marazzi', category: 'Ceramics', code: 'CR-909', prompt: 'Ceppo di Gre stone texture grey terrazzo', price: 'AED 180/sqm' },
    { id: 7, name: 'ANTIQUE BRASS', brand: 'Local Metal', category: 'Metals', code: 'MT-001', prompt: 'brushed antique brass metal texture', price: 'AED 800/sqm' },
    { id: 8, name: 'BOUCLE ALPACA', brand: 'Maharam', category: 'Textiles', code: 'TX-202', prompt: 'white boucle fabric texture extreme close up', price: 'AED 290/m' },
    { id: 9, name: 'NERO MARQUINA', brand: 'Natural Stone', category: 'Stone', code: 'ST-000', prompt: 'black nero marquina marble texture white veins', price: 'AED 650/sqm' },
    { id: 10, name: 'WALNUT CANALETTO', brand: 'Woodworks', category: 'Wood', code: 'WD-404', prompt: 'dark walnut wood grain texture', price: 'AED 350/sqm' },
    { id: 11, name: 'ZELLIEGE EMERALD', brand: 'Handmade', category: 'Ceramics', code: 'CR-330', prompt: 'emerald green zelliege tile texture glossy', price: 'AED 550/sqm' },
    { id: 12, name: 'LINEN SHEER', brand: 'Kvadrat', category: 'Textiles', code: 'TX-101', prompt: 'white linen sheer curtain fabric texture', price: 'AED 120/m' },
];

export const MaterialLibrary: React.FC<MaterialLibraryProps> = ({ isOpen, onClose, onAddToCanvas }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  if (!isOpen) return null;

  const filteredSwatches = activeCategory === 'All' 
    ? MOCK_SWATCHES 
    : MOCK_SWATCHES.filter(s => s.category === activeCategory);

  const handleAddToCanvas = async (swatch: typeof MOCK_SWATCHES[0]) => {
      setLoadingId(swatch.id);
      try {
          // 1. Generate the URL
          const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(swatch.prompt)}?width=400&height=400&nologo=true&format=webp`;
          
          // 2. Fetch the image data
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          // 3. Convert to Base64
          const reader = new FileReader();
          reader.onloadend = () => {
              if (reader.result) {
                  onAddToCanvas(reader.result as string);
                  onClose();
              }
              setLoadingId(null);
          };
          reader.readAsDataURL(blob);

      } catch (error) {
          console.error("Failed to load swatch", error);
          setLoadingId(null);
          alert("Could not load this material. Please try again.");
      }
  };

  return (
    <div className="fixed inset-0 bg-black text-white z-[60] flex font-sans overflow-hidden animate-fade-in selection:bg-white selection:text-black">
        
        {/* Left Panel - The "Summary" List style */}
        <div className="w-[300px] xl:w-[400px] border-r border-white/20 flex flex-col h-full bg-black shrink-0 relative z-10">
            
            {/* Header / Close */}
            <div className="p-8 border-b border-white/20 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter mb-1 leading-none">PALETTE</h1>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/60">Brand Directory</p>
                </div>
                <button 
                    onClick={onClose}
                    className="group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Scrollable List Content */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                
                {/* Index / Categories */}
                <div className="mb-16">
                     <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6 font-mono">Index</h2>
                     <ul className="space-y-0.5">
                        {CATEGORIES.map((cat, i) => (
                            <li 
                                key={cat} 
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                    cursor-pointer text-[10px] uppercase tracking-[0.15em] flex justify-between items-center py-2 border-b border-white/10 group transition-all duration-300
                                    ${activeCategory === cat ? 'text-white border-white pl-2' : 'text-white/50 hover:text-white hover:pl-1'}
                                `}
                            >
                                <span>{cat}</span>
                                <span className="text-[9px] font-mono opacity-50">0{i+1}</span>
                            </li>
                        ))}
                     </ul>
                </div>

                {/* Credits / Brands */}
                <div>
                     <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 mb-6 font-mono">Partners</h2>
                     <ul className="space-y-4">
                        {PREMIUM_BRANDS.map((brand, i) => (
                            <li key={i} className="grid grid-cols-[1fr_auto] gap-4 text-[10px] uppercase tracking-wider text-white/80 hover:text-white cursor-default transition-opacity">
                                <span className="font-medium">{brand.name}</span>
                                <div className="flex gap-3 text-white/40 font-mono text-[9px]">
                                    <span>{brand.type}</span>
                                    <span>{brand.origin}</span>
                                </div>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>

            {/* Footer Metadata */}
            <div className="p-8 border-t border-white/20 mt-auto">
                <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest flex justify-between">
                    <span>Fig 01.</span>
                    <span>Vol 2025</span>
                </div>
            </div>
        </div>

        {/* Right Panel - The Grid */}
        <div className="flex-1 bg-[#0a0a0a] p-8 overflow-y-auto">
             
             {/* Sticky Toolbar */}
             <div className="flex justify-between items-center mb-8 sticky top-0 z-20 mix-blend-difference text-white">
                <div className="text-[10px] font-mono uppercase tracking-widest">
                    Showing {filteredSwatches.length} Items
                </div>
                <div className="flex gap-4">
                     {/* Placeholder for sort/view controls */}
                     <span className="text-[10px] uppercase tracking-widest opacity-50 cursor-pointer hover:opacity-100">[ Grid ]</span>
                     <span className="text-[10px] uppercase tracking-widest opacity-50 cursor-pointer hover:opacity-100">[ List ]</span>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-white/10 border border-white/10">
                {filteredSwatches.map((swatch, idx) => (
                    <div key={swatch.id} className="aspect-square bg-black relative group overflow-hidden border border-black/50">
                        {/* Image */}
                        <img 
                             src={`https://image.pollinations.ai/prompt/${encodeURIComponent(swatch.prompt)}?width=400&height=400&nologo=true&format=webp`}
                             alt={swatch.name}
                             className="w-full h-full object-cover opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                             loading="lazy"
                        />
                        
                        {/* Overlay Number */}
                        <div className="absolute top-3 left-3 text-[9px] font-mono text-white/50 z-10 mix-blend-difference">
                            {String(idx + 1).padStart(2, '0')}
                        </div>

                         {/* Price Tag */}
                        <div className="absolute top-3 right-3 text-[9px] font-mono text-white bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/10 z-10">
                            <span className="opacity-50 mr-1">AVG.</span>
                            {swatch.price}
                        </div>

                        {/* Hover Information */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                            <div className="flex justify-between items-start">
                                <span className="bg-white text-black text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wide">
                                    {swatch.code}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-1">{swatch.name}</h3>
                                <p className="text-[9px] text-white/60 font-mono uppercase tracking-wide mb-4">{swatch.brand}</p>
                                
                                <button 
                                    onClick={() => handleAddToCanvas(swatch)}
                                    disabled={loadingId === swatch.id}
                                    className="w-full border border-white/30 text-white text-[9px] uppercase tracking-widest py-2 hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {loadingId === swatch.id ? (
                                        <>
                                            <div className="w-2 h-2 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                                            Loading
                                        </>
                                    ) : 'Add to Canvas'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    </div>
  );
};
