import { ReactNode } from 'react';
import { Card } from './Card';

export function StatCard({ title, value, helper, icon }: { title: string; value: ReactNode; helper?: string; icon?: ReactNode }) {
  return <Card className="relative overflow-hidden p-5"><div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-indigo-50" /><div className="relative flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>{helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}</div>{icon && <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-2 text-indigo-600">{icon}</div>}</div></Card>;
}
