import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

/**
 * Breadcrumb Component
 * 
 * @param {Array} paths - List of path objects { label: string, onClick: function }
 * @param {Function} onBack - Function to handle back button click
 * @param {Object} colors - Design system colors
 */
export default function Breadcrumb({ paths, onBack, className = '' }) {
  return (
    <div className={`flex items-center gap-[16px] mb-[24px] animate-fade-slide ${className}`}>
      {/* Botão de Voltar */}
      {onBack && (
        <Button
          variant="tertiary"
          appearance="solid"
          tertiaryTone="high"
          iconOnly
          size="sm"
          iconLeft={<ChevronLeft />}
          onClick={onBack}
          className="shadow-sm"
        />
      )}

      {/* Caminho */}
      <nav className="flex items-center gap-[4px] text-[12px] font-semibold tracking-wider">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="mx-[4px] text-brand-500">/</span>
              )}

              {isLast ? (
                <span className="text-neutral-7 dark:text-neutral-2">
                  {path.label}
                </span>
              ) : (
                <span
                  onClick={path.onClick}
                  className="cursor-pointer transition-colors hover:opacity-80 text-brand-500"
                >
                  {path.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}
