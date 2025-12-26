import React from 'react';

export const Badge = ({ children, variant = 'gray', className = '' }) => {
    const variants = {
        gray: 'bg-slate-100 text-slate-700',
        primary: 'bg-primary-50 text-primary-700',
        secondary: 'bg-teal-50 text-teal-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-700 border border-amber-100',
        danger: 'bg-red-50 text-red-700 border border-red-100',
        info: 'bg-blue-50 text-blue-700',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};
