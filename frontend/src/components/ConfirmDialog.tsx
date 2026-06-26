'use client';

import { Button } from './Button';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ open, title, description, confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'default', loading = false, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><div className="w-full max-w-md rounded-xl border bg-white p-6 shadow-sm"><h2 id="confirm-title" className="text-lg font-bold text-slate-950">{title}</h2><p className="mt-2 text-sm text-slate-600">{description}</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={loading} onClick={onCancel} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">{cancelLabel}</button><Button type="button" disabled={loading} onClick={onConfirm} className={variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : ''}>{loading ? 'Loading...' : confirmLabel}</Button></div></div></div>;
}
