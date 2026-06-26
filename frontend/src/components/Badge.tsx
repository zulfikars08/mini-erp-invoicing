import { InvoiceStatus } from '@/types';
const colors: Record<InvoiceStatus,string> = { DRAFT:'bg-slate-100 text-slate-700', SENT:'bg-blue-100 text-blue-700', PAID:'bg-emerald-100 text-emerald-700', CANCELLED:'bg-red-100 text-red-700', OVERDUE:'bg-amber-100 text-amber-800' };
export function Badge({ status }: { status: InvoiceStatus }) { return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>{status}</span>; }
