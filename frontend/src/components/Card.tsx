import { ReactNode } from 'react';
export function Card({ children, className='' }: { children: ReactNode; className?: string }) { return <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-100/50 ${className}`}>{children}</div>; }
