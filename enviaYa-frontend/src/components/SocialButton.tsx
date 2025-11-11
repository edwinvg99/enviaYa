import React from 'react';

interface SocialButtonProps {
  ariaLabel: string;
  viewBox: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  ariaLabel,
  viewBox,
  children,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-full shadow-sm bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition duration-200"
    >
      <svg className="w-5 h-5" viewBox={viewBox} fill="currentColor">
        {children}
      </svg>
    </button>
  );
};

export default SocialButton;
