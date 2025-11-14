import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  // Opcionales para personalizar estilos por instancia
  containerClassName?: string;
  iconWrapperClassName?: string;
  titleClassName?: string;
  messageClassName?: string;
  actionButtonClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
  containerClassName,
  iconWrapperClassName,
  titleClassName,
  messageClassName,
  actionButtonClassName,
}) => {
  return (
    <div className={"flex flex-col items-center justify-center py-12 px-4" + (containerClassName ? ` ${containerClassName}` : "")}>
      {icon ? (
        <div className={"mb-4 text-gray-400" + (iconWrapperClassName ? ` ${iconWrapperClassName}` : "")}>{icon}</div>
      ) : (
        <svg
          className="w-24 h-24 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      )}
      
      <h3 className={"text-xl font-semibold text-gray-100 mb-2" + (titleClassName ? ` ${titleClassName}` : "")}>{title}</h3>
      <p className={"text-gray-600 text-center max-w-md mb-6" + (messageClassName ? ` ${messageClassName}` : "")}>{message}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className={"px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors" + (actionButtonClassName ? ` ${actionButtonClassName}` : "")}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
