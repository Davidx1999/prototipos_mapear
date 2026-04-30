import React from 'react';

const Button = ({ variant = 'primary', size = 'default', iconOnly = false, className = '', children, ...props }) => {
  const variantClasses = {
    primary: 'bg-[var(--primary-base)] text-white border-transparent hover:bg-[var(--primary-dark)] active:bg-[var(--primary-extra-dark)]',
    secondary: 'bg-[var(--primary-light)] text-[var(--primary-dark)] border-transparent hover:bg-[var(--primary-base)] hover:text-[var(--primary-dark)] active:bg-[var(--primary-dark)] active:text-white',
    tertiary: 'bg-transparent text-[var(--neutral-7)] border border-[var(--neutral-3)] hover:bg-[var(--neutral-2)] hover:border-[var(--neutral-3)] active:bg-[var(--neutral-3)]',
    neutral: 'bg-transparent text-[var(--neutral-6)] border-transparent hover:bg-[var(--neutral-3)] active:bg-[var(--neutral-4)]',
    text: 'bg-transparent text-[var(--neutral-5)] border-transparent hover:bg-[var(--neutral-3)] active:bg-[var(--neutral-4)]',
    outlined: 'bg-transparent text-[var(--primary-base)] border border-[var(--primary-base)] hover:bg-[var(--primary-light)] active:bg-[var(--primary-base)] active:text-white',
  };

  let sizeClass = "";
  if (iconOnly) {
    if (size === 'xs') sizeClass = "w-[24px] h-[24px] p-0";
    else if (size === 'sm') sizeClass = "w-[32px] h-[32px] p-0";
    else if (size === 'default') sizeClass = "w-[40px] h-[40px] p-0";
    else if (size === 'lg') sizeClass = "w-[48px] h-[48px] p-0";
  } else {
    if (size === 'xs') sizeClass = "px-[8px] py-[4px] text-[11px]";
    else if (size === 'sm') sizeClass = "px-[12px] py-[6px] text-[12px]";
    else if (size === 'default') sizeClass = "px-[16px] py-[8px] text-[13px] md:text-[14px]";
    else if (size === 'lg') sizeClass = "px-[24px] py-[12px] text-[15px] md:text-[16px]";
  }

  return (
    <button
      className={`
        rounded-[4px] font-semibold transition-all duration-200 
        flex items-center justify-center gap-[8px] cursor-pointer outline-none shrink-0
        active:scale-[0.98] 
        disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale-[0.5]
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClass} 
        ${className}
      `}
      style={props.style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
