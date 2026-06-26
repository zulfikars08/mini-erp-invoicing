'use client';

import { ReactNode } from 'react';

export function Modal({ open, title, description, children, footer, onClose }: { open: boolean; title: string; description?: string; children: ReactNode; footer?: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border bg-white shadow-sm"><div className="flex items-start justify-between gap-4 border-b p-5"><div><h2 id="modal-title" className="text-lg font-bold text-slate-950">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div><button type="button" onClick={onClose} className="rounded-md px-2 text-2xl leading-none text-slate-500 hover:bg-slate-100" aria-label="Close modal">×</button></div><div className="p-5">{children}</div>{footer && <div className="flex justify-end gap-3 border-t bg-slate-50 p-5">{footer}</div>}</div></div>;
}
