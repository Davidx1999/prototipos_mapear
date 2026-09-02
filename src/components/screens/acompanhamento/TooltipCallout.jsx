import React from 'react';

/**
 * White card popup shown when clicking the (?) icon on major blocks
 */
export function BlockInfoCallout({ title, text, onClose }) {
  return (
    <div className="absolute right-0 top-10 z-40 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-3.5 text-left animate-in fade-in zoom-in-95 duration-150">
      <div className="flex justify-between items-start mb-1.5">
        <h4 className="text-xs font-bold text-slate-800 leading-snug">{title}</h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 text-xs font-bold ml-2 p-0.5 rounded"
        >
          ✕
        </button>
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
        {text}
      </p>
    </div>
  );
}

/**
 * Dark tooltip balloon with pointer, matching Image 1
 */
export function DarkTooltipBalloon({ text, position = 'bottom' }) {
  return (
    <div
      className={`absolute z-40 bg-[#1D2432] text-white text-[11px] font-medium leading-tight rounded-md px-3 py-2 shadow-xl pointer-events-none transition-all duration-150 max-w-[240px] text-left ${
        position === 'bottom'
          ? 'top-full left-1/2 -translate-x-1/2 mt-2'
          : 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      }`}
    >
      {/* Pointer arrow */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent ${
          position === 'bottom'
            ? 'bottom-full border-b-4 border-b-[#1D2432]'
            : 'top-full border-t-4 border-t-[#1D2432]'
        }`}
      />
      {text}
    </div>
  );
}
