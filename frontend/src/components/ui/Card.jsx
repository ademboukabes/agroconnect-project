import React from 'react';

export const Card = ({ children, className = '', hover = false }) => {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-premium transition-all duration-300 ${hover ? 'hover:shadow-premium-hover hover:-translate-y-0.5' : ''} ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-slate-50 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`px-6 py-5 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-slate-50/50 border-t border-slate-50 rounded-b-2xl ${className}`}>
        {children}
    </div>
);
