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
  const hasBg = className.split(' ').some(c => c.startsWith('bg-'));
  const bgSticky = hasBg ? '' : (theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#FFFFFF]');
  const borderColor = theme === 'dark' ? 'border-neutral-2' : 'border-[var(--neutral-2)]';

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
