import React from 'react';

export default function Footer({ colors, hasBorder = false, children, className = '', style = {} }) {
  const borderStyle = hasBorder && colors?.neutral?.[2] 
    ? { borderTop: `1px solid ${colors.neutral[2]}` } 
    : {};

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 h-[80px] flex items-center justify-center z-50 ${className}`}
      style={{
        ...borderStyle,
        backgroundColor: colors?.neutral?.[0] || '#FFFFFF',
        ...style
      }}
    >
      {children}
    </footer>
  );
}
