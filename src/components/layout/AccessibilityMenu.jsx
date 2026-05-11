import React from 'react';
import { Accessibility, Contrast } from 'lucide-react';
import Button from '../ui/Button';

const AccessibilityMenu = ({
  colors,
  isHighContrast,
  setIsHighContrast,
  isA11yOpen,
  setIsA11yOpen,
  setIsProfileOpen,
  fontScale,
  setFontScale
}) => {
  return (
    <div className="relative">
      <Button
        variant="primary"
        appearance="solid"
        iconOnly
        size="md"
        iconLeft={<Accessibility />}
        onClick={() => {
          setIsA11yOpen(!isA11yOpen);
          setIsProfileOpen(false);
        }}
      />

      {isA11yOpen && (
        <div
          className="absolute top-[100%] right-0 mt-[8px] w-[260px] md:w-[280px] p-[16px] rounded-[8px] shadow-2xl z-[120] flex flex-col gap-[16px] border animate-fade-slide"
          style={{
            backgroundColor: isHighContrast ? colors.neutral[0] : '#003A79',
            color: isHighContrast ? colors.neutral[7] : '#FFF',
            borderColor: colors.neutral[3]
          }}
        >
          {/* Tradutor de VLibras */}
          <div
            className="flex items-center gap-[12px] cursor-pointer p-[8px] rounded-[8px] transition-all active:scale-[0.98]"
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isHighContrast ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <div
              className="w-[24px] h-[24px] rounded-[4px] font-bold text-[12px] flex justify-center items-center"
              style={{
                backgroundColor: isHighContrast ? colors.primary.base : '#FFFFFF',
                color: isHighContrast ? colors.neutral[0] : '#003A79'
              }}
            >
              VL
            </div>
            <span className="text-[14px] md:text-[14px] font-semibold">Tradutor de VLibras</span>
          </div>

          <hr style={{ borderColor: isHighContrast ? colors.neutral[2] : 'rgba(255,255,255,0.2)' }} />

          {/* Tamanho da fonte */}
          <div className="flex flex-col gap-[12px] px-[8px]">
            <span className="text-[12px] md:text-[14px] font-medium">Tamanho da fonte</span>
            <div className="flex items-center justify-between gap-[12px]">
              <button
                onClick={() => setFontScale(Math.max(1, fontScale - 1))}
                className="text-[12px] font-bold transition-all active:scale-90"
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                A-
              </button>

              {/* Slider Track */}
              <div
                className="flex-1 flex justify-between items-center h-[4px] rounded-full relative cursor-pointer group"
                style={{ backgroundColor: isHighContrast ? colors.neutral[2] : 'rgba(255,255,255,0.2)' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const width = rect.width;
                  const percent = x / width;
                  const step = Math.round(percent * 4) + 1;
                  setFontScale(Math.min(5, Math.max(1, step)));
                }}
              >
                {/* Dots */}
                {[1, 2, 3, 4, 5].map(step => (
                  <div
                    key={step}
                    className="w-[12px] h-[12px] rounded-full transition-all z-10 hover:scale-125"
                    style={{
                      backgroundColor: fontScale >= step
                        ? (isHighContrast ? colors.primary.base : '#FFFFFF')
                        : (isHighContrast ? colors.neutral[3] : 'rgba(255,255,255,0.4)'),
                      transform: fontScale === step ? 'scale(1.3)' : 'scale(1)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFontScale(step);
                    }}
                  />
                ))}

                {/* Active Track Line */}
                <div
                  className="absolute left-0 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(fontScale - 1) * 25}%`,
                    backgroundColor: isHighContrast ? colors.primary.base : '#FFFFFF'
                  }}
                />
              </div>

              <button
                onClick={() => setFontScale(Math.min(5, fontScale + 1))}
                className="text-[16px] md:text-[18px] font-bold transition-all active:scale-90"
                style={{ color: 'inherit' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                A+
              </button>
            </div>
          </div>

          <hr style={{ borderColor: isHighContrast ? colors.neutral[2] : 'rgba(255,255,255,0.2)' }} />

          {/* Alto Contraste */}
          <div
            className="flex items-center gap-[12px] cursor-pointer p-[8px] rounded-[8px] transition-all active:scale-[0.98]"
            onClick={() => { setIsHighContrast(!isHighContrast); setIsA11yOpen(false); }}
            style={{ backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isHighContrast ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Contrast size={20} />
            <span className="text-[14px] md:text-[14px] font-semibold">
              {isHighContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
