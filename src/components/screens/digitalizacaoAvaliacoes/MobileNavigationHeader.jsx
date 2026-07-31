import React from 'react';
import { ArrowLeft, Bookmark, Save, Users, GraduationCap, Plus } from 'lucide-react';

export default function MobileNavigationHeader({
  title,
  onBack = null,
  iconType = null,
  isHeaderHidden = false,
  themeColors,
  onAddPage = null
}) {
  return (
    <div className="shrink-0 z-30 bg-white border-b border-neutral-100">
      <div
        className={`h-[56px] flex items-center justify-between px-[16px] bg-white ${
          onBack ? '' : 'border-b shadow-sm'
        }`}
        style={{ borderColor: themeColors?.neutral?.[2] || '#f1f5f9' }}
      >
        <div className="flex items-center gap-[10px] min-w-0">
          {onBack ? (
            <button
              onClick={onBack}
              className="w-[32px] h-[32px] rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 transition-colors shrink-0"
              title="Voltar"
            >
              <ArrowLeft size={20} />
            </button>
          ) : (
            <div className="flex items-center gap-[8px]">
              <div className="w-[32px] h-[32px] rounded-lg bg-[#E6F6FC] border border-[#B3E6F5] flex items-center justify-center">
                <img src="assets/fgv_logo.png" alt="MAPEAR" className="h-[18px] object-contain" />
              </div>
            </div>
          )}

          <span
            className="text-[18px] font-black text-neutral-800 tracking-tight truncate"
            style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
          >
            {title}
          </span>
        </div>

        <div className="flex items-center gap-[6px] shrink-0">
          {iconType === 'bookmark' && (
            <button className="w-[38px] h-[38px] rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-[#003A79] transition-colors shadow-sm">
              <Bookmark size={18} />
            </button>
          )}

          {iconType === 'save' && (
            <button className="w-[38px] h-[38px] rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-[#003A79] transition-colors shadow-sm">
              <Save size={18} />
            </button>
          )}

          {iconType === 'users' && (
            <button className="w-[38px] h-[38px] rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-[#003A79] transition-colors shadow-sm">
              <Users size={18} />
            </button>
          )}

          {iconType === 'graduation' && (
            <button className="w-[38px] h-[38px] rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-[#003A79] transition-colors shadow-sm">
              <GraduationCap size={18} />
            </button>
          )}

          {iconType === 'add-page' && (
            <button
              onClick={onAddPage}
              className="w-[38px] h-[38px] rounded-xl border border-neutral-300 hover:bg-neutral-50 flex items-center justify-center text-[#008BC9] transition-colors shadow-sm"
              title="Adicionar página"
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
