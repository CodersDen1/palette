// DO NOT add any new files, classes, or namespaces.
// Fix: Removed readonly from aistudio declaration to match identical modifiers requirement.

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { UploadZone } from './components/UploadZone';
import { CanvasNodes } from './components/CanvasNodes';
import { ItemDetails } from './components/ItemDetails';
import { BOQTable } from './components/BOQTable';
import { SpecsSheet } from './components/SpecsSheet';
import { FloatingMenu } from './components/FloatingMenu';
import { ChatInterface } from './components/ChatInterface';
import { ImageEditor } from './components/ImageEditor';
import { LandingPage } from './components/LandingPage';
import { MaterialLibrary } from './components/MaterialLibrary';
import { SearchIndex } from './components/SearchIndex';
import { detectItemsFast, enrichItemData, identifyItemAtCoordinate, editInteriorImage } from './services/geminiService';
import { AnalyzedItem } from './types';

// Extend window for AI Studio helpers with correct type definition to avoid redeclaration errors
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Fixed: Removed readonly to ensure compatibility with identical modifiers in existing environment declarations.
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'canvas'>('landing');
  const [image, setImage] = useState<string | null>(null);
  const [referenceImages, setReferenceImages] = useState<[string | null, string | null]>([null, null]);
  const [items, setItems] = useState<AnalyzedItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showBOQ, setShowBOQ] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);
  const [isProcessingEdit, setIsProcessingEdit] = useState(false);
  const [activeEditRefIndex, setActiveEditRefIndex] = useState<number | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 0.95 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        setHasApiKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleStart = () => setView('canvas');
  const handleGoHome = () => {
      setView('landing');
      setImage(null);
      setItems([]);
      setSelectedItemId(null);
  };

  const handleReferenceUpload = (index: 0 | 1, base64: string | null) => {
    setReferenceImages(prev => {
        const next = [...prev] as [string | null, string | null];
        next[index] = base64;
        return next;
    });
  };

  const handleImageSelected = useCallback(async (base64: string) => {
    setImage(base64);
    setIsAnalyzing(true);
    setIsSidebarOpen(true);
    setAnalysisStep('SCENE_MAPPING');
    setError(null);
    setItems([]); 
    setSelectedItemId(null);
    setTransform({ x: 0, y: 0, scale: 0.95 });
    
    try {
      const detectedItems = await detectItemsFast(base64);
      if (!detectedItems || detectedItems.length === 0) {
        setItems([]);
        setIsAnalyzing(false);
        return;
      }

      const initialItems: AnalyzedItem[] = detectedItems.map((d, i) => ({
          ...d,
          id: `item-${Date.now()}-${i}`,
          isUpdating: true,
          description: d.description || '',
          material: d.material || '',
          quantityEstimate: d.quantityEstimate || '1 UNIT',
          searchQuery: d.searchQuery || d.name || '',
          averagePrice: 'AED_CALCULATING',
          vendors: [],
          similarProducts: [],
          groundingSources: []
      } as AnalyzedItem));

      setItems(initialItems);
      setIsAnalyzing(false); 
      setAnalysisStep('');

      initialItems.forEach(async (item) => {
          try {
              const enrichedData = await enrichItemData(base64, item);
              setItems(prev => prev.map(p => p.id === item.id ? { ...p, ...enrichedData, isUpdating: false } : p));
          } catch (e) {
              setItems(prev => prev.map(p => p.id === item.id ? { ...p, isUpdating: false, averagePrice: 'REQ_MANUAL' } : p));
          }
      });
    } catch (err: any) {
      setError(err.message || "SCAN_ERROR");
      setIsAnalyzing(false);
    }
  }, []);

  const handleNodeSelect = (id: string) => {
    setSelectedItemId(id);
    setIsSidebarOpen(true);
  };

  const handleNodeMove = (id: string, x: number, y: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, x, y } : item));
  };

  const handleNodeDragEnd = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item || !image) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, isUpdating: true } : i));
    try {
      const updatedData = await identifyItemAtCoordinate(image, item.x, item.y);
      setItems(prev => prev.map(i => i.id === id ? { ...i, ...updatedData, isUpdating: false } : i));
    } catch (error) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, isUpdating: false } : i));
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case 'new': setImage(null); setItems([]); setSelectedItemId(null); break;
      case 'rescan': if(image) handleImageSelected(image); break;
      case 'boq': setShowBOQ(true); break;
      case 'specs': setShowSpecs(true); break;
      case 'materials': setShowMaterials(true); break;
      case 'chat': setShowChat(true); break;
      case 'edit': setShowEditor(true); break;
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!image || isAnalyzing) return;
    if (e.button === 0) {
      setIsDraggingCanvas(true);
      dragStartRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!image || isAnalyzing) return;
    const delta = -e.deltaY * 0.0015;
    const newScale = Math.min(Math.max(0.05, transform.scale + delta), 6);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingCanvas) return;
      setTransform(prev => ({ ...prev, x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y }));
    };
    const handleWindowMouseUp = () => setIsDraggingCanvas(false);
    if (isDraggingCanvas) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDraggingCanvas]);

  if (view === 'landing') return <LandingPage onStart={handleStart} />;

  if (hasApiKey === false) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Pro Mode Setup</h2>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest leading-relaxed">
              Magic Swap (Nano Pro) requires a paid API key for high-quality architectural generation.
              <br/><br/>
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline text-white hover:text-zinc-400">View Billing Documentation</a>
            </p>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-white text-black py-6 text-[11px] font-black uppercase tracking-[0.6em] shadow-2xl hover:bg-zinc-200 transition-all"
          >
            Select API Key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-white overflow-hidden flex font-sans text-black relative select-none">
      
      {/* Background Grid */}
      <div className="absolute inset-0 canvas-grid pointer-events-none opacity-40"></div>

      <div className="flex-1 relative flex flex-col z-10">
        
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 z-[100] px-12 py-10 flex justify-between items-start pointer-events-none">
          <button 
            onClick={handleGoHome} 
            className="pointer-events-auto bg-black text-white px-8 py-2.5 text-[12px] font-black tracking-[0.4em] uppercase hover:bg-zinc-800 transition-all shadow-2xl"
          >
            PALETTE
          </button>
          
          <div className="pointer-events-auto flex gap-6 font-mono text-[8px] font-bold text-black/30 uppercase tracking-[0.3em]">
            <div className="flex flex-col items-end">
                <span>POS_X: {transform.x.toFixed(0)}</span>
                <span>POS_Y: {transform.y.toFixed(0)}</span>
            </div>
            <div className="h-6 w-px bg-black/5"></div>
            <div className="flex flex-col items-end">
                <span>ZOOM: {(transform.scale * 100).toFixed(0)}%</span>
                <span>ENGINE_READY</span>
            </div>
          </div>
        </header>

        {error && (
            <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[150] w-full max-w-xs">
                <div className="bg-black text-white px-5 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
                    <p className="text-[9px] font-mono uppercase tracking-widest leading-relaxed">ERROR: {error}</p>
                    <button onClick={() => setError(null)} className="ml-4 opacity-50 hover:opacity-100">✕</button>
                </div>
            </div>
        )}

        {/* Main Interaction Canvas */}
        <main 
            className="flex-1 relative overflow-hidden flex items-center justify-center cursor-crosshair"
            onMouseDown={handleCanvasMouseDown}
            onWheel={handleWheel}
        >
            {!image ? (
                <div className="relative z-20"><UploadZone onImageSelected={handleImageSelected} /></div>
            ) : (
                <div 
                    className="relative transition-transform duration-150 ease-out"
                    style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
                >
                     <div className="relative border border-black/10 p-2 bg-white shadow-[0_120px_200px_-80px_rgba(0,0,0,0.3)]">
                        <img 
                            src={image} 
                            className={`max-w-[92vw] max-h-[88vh] object-contain block transition-all duration-1000 ${isAnalyzing ? 'opacity-20 blur-xl scale-95' : 'opacity-100 grayscale-[0.1]'}`} 
                            draggable={false} 
                        />
                        
                        {!isAnalyzing && (
                            <CanvasNodes 
                                items={items} 
                                selectedItemId={selectedItemId} 
                                onSelect={handleNodeSelect} 
                                onMove={handleNodeMove} 
                                onDragEnd={handleNodeDragEnd} 
                            />
                        )}

                        {isAnalyzing && (
                             <div className="absolute inset-0 bg-white/5 pointer-events-none overflow-hidden">
                                <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
                                    {[...Array(144)].map((_, i) => (
                                        <div key={i} className="border border-black/10"></div>
                                    ))}
                                </div>
                             </div>
                        )}
                     </div>
                </div>
            )}
            
            {/* ANALYSIS LOADER */}
            {isAnalyzing && (
                <div className="absolute inset-0 z-[150] flex items-center justify-center bg-white/40 backdrop-blur-xl animate-in fade-in duration-700">
                    <div className="relative flex flex-col items-center">
                        <div className="relative w-80 h-80 flex items-center justify-center">
                            <div className="absolute inset-0 border border-black/5 rounded-full"></div>
                            <div className="absolute inset-8 border border-black/5 rounded-full"></div>
                            <div className="absolute inset-16 border border-black/10 rounded-full"></div>
                            <div className="absolute inset-0 rounded-full animate-[spin_4s_linear_infinite] radar-sweep"></div>
                            <div className="w-1.5 h-1.5 bg-black rounded-full shadow-[0_0_20px_white]"></div>
                        </div>
                        <div className="mt-12 text-center space-y-2">
                            <div className="flex items-center justify-center gap-3">
                                <span className="w-1.5 h-1.5 bg-black animate-ping"></span>
                                <h2 className="text-[11px] font-black tracking-[0.8em] text-black uppercase">{analysisStep}</h2>
                            </div>
                            <p className="font-mono text-[8px] text-black/30 uppercase tracking-[0.2em]">Procurement Engine Alpha V.2</p>
                        </div>
                    </div>
                </div>
            )}

            {image && !isAnalyzing && (
                <div className="fixed left-12 top-1/2 -translate-y-1/2 z-[60] animate-in slide-in-from-left duration-700">
                    <FloatingMenu onAction={handleMenuAction} />
                </div>
            )}

            {/* EXPAND SIDEBAR BUTTON (When closed) */}
            {image && !isAnalyzing && !isSidebarOpen && (
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="fixed right-0 top-1/2 -translate-y-1/2 z-[120] bg-black text-white px-2 py-8 group transition-all hover:pr-4"
                >
                  <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Expand Index</span>
                  <span className="block text-lg">←</span>
                </button>
            )}
        </main>
      </div>

      {/* SEARCH LIST SIDEBAR / ITEM DOSSIER */}
      <aside className={`bg-white z-[110] h-full shadow-2xl border-l border-zinc-100 transition-all duration-500 ease-in-out relative overflow-hidden ${image && !isAnalyzing && isSidebarOpen ? 'w-[580px]' : 'w-0'}`}>
        {/* COLLAPSE BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-10 left-6 z-[130] p-3 bg-zinc-50 border border-zinc-200 hover:bg-black hover:text-white transition-all group"
        >
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="w-[580px] h-full">
            {!selectedItemId ? (
                <SearchIndex items={items} onSelect={handleNodeSelect} isAnalyzing={isAnalyzing} />
            ) : (
                <ItemDetails originalImage={image} item={items.find(i => i.id === selectedItemId) || null} onClose={() => setSelectedItemId(null)} />
            )}
        </div>
      </aside>

      {/* Modals */}
      <BOQTable items={items} isOpen={showBOQ} onClose={() => setShowBOQ(false)} originalImage={image} />
      <SpecsSheet items={items} isOpen={showSpecs} onClose={() => setShowSpecs(false)} image={image} />
      <MaterialLibrary isOpen={showMaterials} onClose={() => setShowMaterials(false)} onAddToCanvas={(b) => handleImageSelected(b)} />
      <ChatInterface isOpen={showChat} onClose={() => setShowChat(false)} />
      <ImageEditor 
        isOpen={showEditor} 
        currentImage={image}
        onClose={() => setShowEditor(false)} 
        onSubmit={async (p, r) => {
            if(!image) return;
            setIsProcessingEdit(true);
            try {
                const res = await editInteriorImage(image, p, r);
                setImage(res);
                setShowEditor(false);
                handleImageSelected(res);
            } catch(e: any) { 
                if (e.message?.includes("Requested entity was not found")) {
                  setError("API Key verification failed. Please re-select key.");
                  setHasApiKey(false);
                } else {
                  setError(e.message || "Neural engine generation error."); 
                }
            } finally { setIsProcessingEdit(false); }
        }} 
        isProcessing={isProcessingEdit} 
        referenceImages={referenceImages} 
        initialReferenceIndex={activeEditRefIndex}
        onReferenceUpload={handleReferenceUpload}
      />
    </div>
  );
};

export default App;