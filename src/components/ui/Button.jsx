
import React from 'react';

const Button = ({ variant = 'primary', size = 'default', iconOnly = false, className = '', children, ...props }) => {
  let varStyle = {};
  if (variant === 'primary') varStyle = { backgroundColor: 'var(--primary-base)', color: '#FFF', borderColor: 'transparent' };
  else if (variant === 'secondary') varStyle = { backgroundColor: 'var(--primary-light)', color: 'var(--primary-base)', borderColor: 'transparent' };
  else if (variant === 'tertiary') varStyle = { backgroundColor: 'transparent', color: 'var(--neutral-7)', borderColor: 'var(--neutral-3)', borderStyle: 'solid', borderWidth: '1px' };
  else if (variant === 'text') varStyle = { backgroundColor: 'transparent', color: 'var(--neutral-5)', borderColor: 'transparent' };
  else if (variant === 'outlined') varStyle = { backgroundColor: 'transparent', color: 'var(--primary-base)', borderColor: 'var(--primary-base)', borderStyle: 'solid', borderWidth: '1px' };

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
      className={`rounded-[4px] font-semibold transition-all duration-200 flex items-center justify-center gap-[8px] cursor-pointer outline-none shrink-0 ${sizeClass} ${className}`} 
      style={varStyle}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
