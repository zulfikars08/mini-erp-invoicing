import { SelectHTMLAttributes } from 'react';
export function Select({ className='', ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${className}`} {...props} />; }
