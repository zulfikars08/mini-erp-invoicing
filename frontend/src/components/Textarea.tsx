import { TextareaHTMLAttributes } from 'react';
export function Textarea({ className='', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 ${className}`} {...props} />; }
