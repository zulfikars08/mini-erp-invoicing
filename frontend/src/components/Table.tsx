import { ReactNode } from 'react';
export function Table({ children }: { children: ReactNode }) { return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left text-sm">{children}</table></div>; }
export function Th({ children }: { children: ReactNode }) { return <th className="border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{children}</th>; }
export function Td({ children }: { children: ReactNode }) { return <td className="border-b border-slate-100 px-4 py-3.5 text-slate-700">{children}</td>; }
