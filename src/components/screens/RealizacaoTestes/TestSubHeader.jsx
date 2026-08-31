import React from 'react';

/**
 * TestSubHeader Component
 * Elemento fixo abaixo do header principal do sistema.
 */
const TestSubHeader = ({
  theme = 'light',
  children,
  className = '',
  ...props
}) => {
  const hasBg = className.split(' ').some(c => c.startsWith('bg-'));
  const bgSticky = hasBg ? '' : 'bg-bg-container';
  const borderColor = 'border-border';

  return (
    <div
      className={`relative z-[900] w-full border-b ${borderColor} ${bgSticky} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default TestSubHeader;

