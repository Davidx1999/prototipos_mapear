import React from 'react';

/**
 * Typography Component
 * Standardizes all text styles in the Mapear system based on Montserrat.
 * 
 * Variants:
 * - h1: 42px
 * - h2: 36px
 * - h3: 30px
 * - h4: 28px
 * - h5: 22px
 * - h6: 18px
 * - subtitle: 16px
 * - s: 14px (body/s)
 * - xs: 12px (body/xs)
 * - xxs: 10px (body/xxs)
 * 
 * Weights:
 * - regular: 400
 * - medium: 500
 * - semibold: 600
 * - bold: 700
 */
const Typography = ({
  variant = 's',
  weight = 'regular',
  color,
  as,
  className = '',
  children,
  style = {},
  ...props
}) => {
  // Map variant to default HTML tag if 'as' is not provided
  const variantTagMap = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle: 'p',
    s: 'p',
    xs: 'p',
    xxs: 'span'
  };

  const Component = as || variantTagMap[variant] || 'p';

  // Base Montserrat family
  const baseStyles = {
    fontFamily: "'Montserrat', sans-serif",
    transition: 'color 0.2s ease'
  };

  // Font Size Map
  const sizeStyles = {
    h1: 'text-[42px] leading-[1.2]',
    h2: 'text-[36px] leading-[1.2]',
    h3: 'text-[30px] leading-[1.3]',
    h4: 'text-[28px] leading-[1.3]',
    h5: 'text-[22px] leading-[1.4]',
    h6: 'text-[18px] leading-[1.4]',
    subtitle: 'text-[16px] leading-[1.5]',
    s: 'text-[14px] leading-[1.5]',
    xs: 'text-[12px] leading-[1.5]',
    xxs: 'text-[10px] leading-[1.5]'
  };

  // Weight Map
  const weightStyles = {
    regular: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const combinedStyles = `
    ${sizeStyles[variant] || sizeStyles.s}
    ${weightStyles[weight] || weightStyles.regular}
    ${className}
  `.trim();

  return (
    <Component 
      className={combinedStyles}
      style={{ 
        ...baseStyles, 
        color: color || 'inherit',
        ...style 
      }}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Typography;
