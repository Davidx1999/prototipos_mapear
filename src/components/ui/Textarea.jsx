import React from 'react';

/**
 * Textarea Component
 * Scalable, design-system-driven component for the Mapear Design System.
 */
const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  fullWidth = true,
  style,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-[6px] ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="text-[14px] md:text-[14px] font-semibold text-[var(--color-neutral-6)]">
          {label}
        </label>
      )}

      <textarea
        style={{ ...style }}
        className={`
          w-full bg-[var(--color-neutral-0)] border text-[14px] md:text-[14px] outline-none transition-all
          rounded-[4px] px-[16px] py-[12px] resize-y
          ${error
            ? 'border-red-500 focus:border-red-600'
            : 'border-[var(--color-neutral-3)] focus:border-[2px] focus:border-[var(--color-brand-500)] focus:ring-2 focus:ring-[var(--color-brand-300)]'}
          placeholder:text-[var(--color-neutral-4)]
          placeholder:font-normal
          text-[var(--color-neutral-7)]
          disabled:bg-[var(--color-neutral-1)] disabled:text-[var(--color-neutral-4)] disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />

      {(error || helperText) && (
        <p className={`text-[11px] md:text-[12px] mt-[2px] ${error ? 'text-red-500 font-medium' : 'text-[var(--color-neutral-5)]'}`}>
          {typeof error === 'string' ? error : helperText}
        </p>
      )}
    </div>
  );
};

export default Textarea;
