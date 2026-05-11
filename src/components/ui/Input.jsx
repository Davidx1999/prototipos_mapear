import React from 'react';

/**
 * Input Component
 * Scalable, design-system-driven component for the Mapear Design System.
 */
const Input = ({
  label,
  iconLeft,
  iconRight,
  error,
  helperText,
  className = '',
  fullWidth = true,
  height = '40px',
  iconSize = 18,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-[6px] ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-[14px] md:text-[14px] font-semibold text-[var(--neutral-6)]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {iconLeft && (
          <div className="absolute left-[16px] inset-y-0 text-[var(--neutral-4)] flex items-center justify-center pointer-events-none transition-colors group-focus-within:text-[var(--primary-base)]">
            {React.cloneElement(iconLeft, { size: iconSize, strokeWidth: 2 })}
          </div>
        )}

        <input
          style={{ height }}
          className={`
            w-full bg-[var(--neutral-0)] border text-[14px] md:text-[14px] outline-none transition-all
            rounded-[4px] px-[16px]
            ${iconLeft ? 'pl-[44px]' : ''}
            ${iconRight ? 'pr-[44px]' : ''}
            ${error
              ? 'border-red-500 focus:border-red-600'
              : 'border-[var(--neutral-3)] focus:border-[2px] focus:border-[var(--primary-base)] focus:ring-2 focus:ring-[var(--primary-light)]'}
            placeholder:text-[var(--neutral-4)]
            placeholder:font-normal
            text-[var(--neutral-7)]
            disabled:bg-[var(--neutral-1)] disabled:text-[var(--neutral-4)] disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />

        {iconRight && (
          <div className="absolute right-[16px] inset-y-0 text-[var(--neutral-4)] flex items-center justify-center cursor-pointer transition-colors hover:text-[var(--neutral-6)]">
            {React.cloneElement(iconRight, { size: iconSize, strokeWidth: 2 })}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`text-[11px] md:text-[12px] mt-[2px] ${error ? 'text-red-500 font-medium' : 'text-[var(--neutral-5)]'}`}>
          {typeof error === 'string' ? error : helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
