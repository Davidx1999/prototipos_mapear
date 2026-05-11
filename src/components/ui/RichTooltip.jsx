import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * RichTooltip Component
 * A premium tooltip with click trigger, portal rendering (to avoid clipping),
 * and specific design requirements.
 */
export default function RichTooltip({
  title,
  description,
  buttons = [],
  onButtonClick = () => { },
  children,
  position = 'right',
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updateCoords = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();

      if (position === 'right') {
        setCoords({
          top: rect.top,
          left: rect.right + 4
        });
      } else if (position === 'left') {
        setCoords({
          top: rect.top + rect.height / 2,
          left: rect.left - 12
        });
      } else if (position === 'top') {
        setCoords({
          top: rect.top - 12,
          left: rect.left + rect.width / 2
        });
      } else {
        setCoords({
          top: rect.bottom + 12,
          left: rect.left + rect.width / 2
        });
      }
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isVisible]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (targetRef.current && !targetRef.current.contains(event.target)) {
        // Se clicar fora do target, mas não temos ref do tooltip aqui...
        // Vou simplificar: qualquer clique fora do target fecha.
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  const transformClass = {
    right: '',
    left: '-translate-y-1/2 -translate-x-full',
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
  }[position];

  return (
    <>
      <div
        ref={targetRef}
        className={`inline-block ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(!isVisible);
        }}
      >
        {typeof children === 'function' ? children({ isVisible }) : children}
      </div>

      {isVisible && createPortal(
        <div
          className={`
            fixed z-[9999] min-w-[320px] w-fit max-w-[400px]
            bg-[#F3F4F6] rounded-[4px] border border-gray-200
            shadow-[0_20px_50px_-12px_rgba(0,58,121,0.4)]
            px-4 pt-4 pb-4
            animate-fade-slide pointer-events-auto
            ${transformClass}
          `}
          style={{ top: coords.top, left: coords.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <h4 className="text-[14px] font-medium text-gray-900 mb-1 leading-tight">
              {title}
            </h4>
          )}

          {description && (
            <p className="text-[14px] font-normal text-gray-600 mb-3 leading-relaxed">
              {description}
            </p>
          )}

          {buttons.length > 0 && (
            <div className="flex items-center gap-4">
              {buttons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onButtonClick(btn.action || btn.label || btn);
                    setIsVisible(false);
                  }}
                  className="text-[14px] font-semibold text-[#008BC9] hover:text-[#003A79] transition-colors outline-none"
                >
                  {btn.label || btn}
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
