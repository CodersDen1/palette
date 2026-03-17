
import React from 'react';

interface FloatingMenuProps {
  onAction: (action: string) => void;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({ onAction }) => {
  const menuItems = [
    { id: 'rescan', label: 'Re-Analyze' },
    { id: 'materials', label: 'Swatches' },
    { id: 'boq', label: 'BOQ' },
    { id: 'specs', label: 'Spec Sheets' },
    { id: 'chat', label: 'Procurement AI' },
    { id: 'edit', label: 'Magic Swap' },
    { id: 'new', label: 'Clear All' },
  ];

  return (
    <div className="flex flex-col gap-3 pointer-events-auto">
      {menuItems.map((item) => {
        return (
            <button
            key={item.id}
            onClick={() => onAction(item.id)}
            className={`
                px-6 py-3 
                rounded-full 
                shadow-[0_4px_12px_rgba(0,0,0,0.03)]
                font-medium text-[10px] 
                tracking-[0.15em]
                uppercase
                active:scale-95
                transition-all duration-300
                backdrop-blur-md
                text-center
                w-44
                bg-white/90 text-black border border-zinc-100 hover:bg-black hover:text-white hover:border-black hover:shadow-xl
            `}
            >
            {item.label}
            </button>
        );
      })}
    </div>
  );
};
