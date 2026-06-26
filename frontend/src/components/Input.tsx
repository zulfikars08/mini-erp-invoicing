import { InputHTMLAttributes } from 'react';
export function Input({ className='', ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={`h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${className}`} {...props} />; }
