import React from 'react';

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm shadow-primary-200',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-primary-600 shadow-sm',
        accent: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 shadow-sm',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 shadow-sm',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2.5 rounded-xl',
        lg: 'px-6 py-3 text-lg rounded-2xl',
    };

    return (
        <button
            className={`inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon className={`h-5 w-5 ${children ? 'mr-2' : ''}`} />}
            {children}
        </button>
    );
};
