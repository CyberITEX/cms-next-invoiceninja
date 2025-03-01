import React from 'react';

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border border-transparent focus:ring-blue-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-blue-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-green-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-transparent',
  };

  const sizeStyles = {
    xs: 'py-1 px-2 text-xs',
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-2.5 px-5 text-base',
    xl: 'py-3 px-6 text-lg',
  };

  const disabledStyles = 'opacity-60 cursor-not-allowed';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : ''}
        ${className || ''}
      `}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
}