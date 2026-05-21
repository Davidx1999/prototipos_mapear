import React from 'react';

/**
 * TestSubHeader Component
 * A sticky element that remains fixed below the main system header.
 * Does NOT render task-specific content — that content scrolls with the page.
 */
const TestSubHeader = ({
  theme = 'light',
  children,
  className = '',
  ...props
}) => {
  const bgSticky = theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#FFFFFF]';
  const borderColor = theme === 'dark' ? 'border-neutral-2' : 'border-[var(--neutral-2)]';

  return (
    <div
      className={`sticky top-0 z-10 w-full border-b ${borderColor} ${bgSticky} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default TestSubHeader;
