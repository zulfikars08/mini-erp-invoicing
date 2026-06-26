import { ReactNode } from 'react';

export function FormField({ label, required, helperText, error, disabled, children }: { label: string; required?: boolean; helperText?: string; error?: string; disabled?: boolean; children: ReactNode }) {
  return <label className={`grid gap-1 text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}><span className="min-h-5 leading-5">{label}{required && <span className="ml-1 text-red-600">*</span>}</span>{children}<span className="mt-1 min-h-5 text-sm leading-5">{error ? <span className="font-medium text-red-600">{error}</span> : helperText ? <span className="font-normal text-slate-500">{helperText}</span> : <span aria-hidden="true">&nbsp;</span>}</span></label>;
}
