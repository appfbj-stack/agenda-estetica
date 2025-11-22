import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ElementType;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  isLoading,
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-200 focus:ring-brand-500",
    secondary: "bg-brand-100 text-brand-800 hover:bg-brand-200 focus:ring-brand-400",
    outline: "border-2 border-gray-200 text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 focus:ring-gray-400",
    danger: "bg-red-100 text-red-600 hover:bg-red-200 focus:ring-red-500",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />
      ) : null}
      {children}
    </button>
  );
};