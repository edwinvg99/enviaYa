import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  shadow = 'sm'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverClass = hover ? 'hover:shadow-2xl hover:scale-[1.02] hover:border-gray-200' : '';

  return (
    <div
      className={`
        bg-white 
        rounded-2xl 
        border border-gray-100
        ${shadowClasses[shadow]}
        ${paddingClasses[padding]}
        ${hoverClass}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
