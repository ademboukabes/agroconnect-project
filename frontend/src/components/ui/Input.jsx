import React from 'react';

export const Input = ({ label, error, className = '', containerClassName = '', ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-xs font-medium text-red-500 ml-1">{error}</span>}
        </div>
    );
};

export const Select = ({ label, options, error, className = '', containerClassName = '', ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
            {label && (
                <label className="text-sm font-semibold text-slate-700 ml-1">
                    {label}
                </label>
            )}
            <select
                className={`w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 appearance-none bg-no-repeat bg-[right_1rem_center] bg-[length:1em_1em] ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")` }}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className="text-xs font-medium text-red-500 ml-1">{error}</span>}
        </div>
    );
};
