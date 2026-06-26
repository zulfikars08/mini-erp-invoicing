import { ToastVariant } from './ToastProvider';

const styles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-amber-200 bg-amber-50',
  info: 'border-indigo-200 bg-indigo-50',
};

const labels: Record<ToastVariant, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

export function Toast({ toast, onClose }: { toast: { title: string; message?: string; variant: ToastVariant }; onClose: () => void }) {
  return <div role="status" className={`w-full max-w-sm rounded-xl border p-4 text-sm text-slate-800 shadow-sm transition ${styles[toast.variant]}`}><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{labels[toast.variant]}</p><p className="mt-1 font-semibold">{toast.title}</p>{toast.message && <p className="mt-1 text-slate-600">{toast.message}</p>}</div><button type="button" onClick={onClose} aria-label="Close notification" className="rounded-md px-2 text-lg leading-none text-slate-500 hover:bg-white/70 hover:text-slate-900">×</button></div></div>;
}
