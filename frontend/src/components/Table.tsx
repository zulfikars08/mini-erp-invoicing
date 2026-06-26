import { ReactNode } from 'react';
export function Table({ children }: { children: ReactNode }) { return <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm">{children}</table></div>; }
export function Th({ children }: { children: ReactNode }) { return <th className="border-b bg-slate-50 px-4 py-3 font-semibold text-slate-600">{children}</th>; }
export function Td({ children }: { children: ReactNode }) { return <td className="border-b px-4 py-3 text-slate-700">{children}</td>; }
