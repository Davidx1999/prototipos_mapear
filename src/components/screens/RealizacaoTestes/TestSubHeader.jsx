import React from 'react';

/**
 * TestSubHeader Component
 * Used to display the header of the active task, containing the label, title, and description.
 * It is styled as a sticky element that remains fixed below the main system header.
 */
const TestSubHeader = ({
  title = '',
  description = '',
  theme = 'light',
  fontSize,
  showShadow = false,
  className = '',
  ...props
}) => {
  const taskMatch = title.match(/^(Tarefa \d+):\s*(.*)$/i);
  const taskLabel = taskMatch ? taskMatch[1] : 'Tarefa';
  const taskSub = taskMatch ? taskMatch[2] : title;

  const t = {
    textMain: theme === 'dark' ? 'text-white' : 'text-neutral-7',
    border: theme === 'dark' ? 'border-neutral-2' : 'border-neutral-2',
    bgBox: theme === 'dark' ? 'bg-neutral-6' : 'bg-neutral-1',
    bgSticky: theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#FFFFFF]',
  };

  return (
    <div 
      className={`sticky top-0 z-10 flex flex-col gap-2 pb-4 -mt-2 ${t.bgSticky} ${className}`} 
      style={fontSize ? { fontSize: `${fontSize}px` } : undefined}
      {...props}
    >
      {/* Stacked Task Header with Left Rectangle */}
      <div className="flex items-stretch gap-2 mb-1 pt-2 animate-fade-slide">
        {/* Left rectangle */}
        <div className="w-[6px] bg-[#008BC9] rounded-sm shrink-0"></div>
        <div className="flex flex-col justify-center leading-tight">
          <span className="text-[14px] font-medium text-gray-500 tracking-wider">
            {taskLabel}
          </span>
          <h2 className={`text-[18px] font-semibold ${t.textMain}`}>
            {taskSub}
          </h2>
        </div>
      </div>

      {/* Task-level Description Box below the title */}
      {description && (
        <div className={`w-full px-[20px] pt-[16px] pb-[24px] rounded-[8px] border ${t.border} ${t.bgBox} ${showShadow ? 'shadow-sm' : ''}`}>
          <p className={`text-[14px] md:text-[15px] leading-relaxed text-justify ${theme === 'dark' ? 'text-neutral-1' : 'text-neutral-7'}`}>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default TestSubHeader;
