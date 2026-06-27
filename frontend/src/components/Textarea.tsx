import { TextareaHTMLAttributes } from 'react';
export function Textarea({ className='', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${className}`} {...props} />; }
