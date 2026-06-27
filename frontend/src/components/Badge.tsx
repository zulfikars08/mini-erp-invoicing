import { InvoiceStatus } from '@/types';
const colors: Record<InvoiceStatus,string> = { DRAFT:'bg-slate-100 text-slate-700 ring-slate-200', SENT:'bg-blue-50 text-blue-700 ring-blue-200', PAID:'bg-emerald-50 text-emerald-700 ring-emerald-200', CANCELLED:'bg-red-50 text-red-700 ring-red-200', OVERDUE:'bg-amber-50 text-amber-800 ring-amber-200' };
export function Badge({ status }: { status: InvoiceStatus }) { return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${colors[status]}`}>{status}</span>; }
