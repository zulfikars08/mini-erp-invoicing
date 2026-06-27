import { ButtonHTMLAttributes } from 'react';
export function Button({ className='', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />;
}
