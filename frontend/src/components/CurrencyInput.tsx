import { InputHTMLAttributes } from 'react';
import { FormField } from './FormField';
import { formatIdr } from '@/lib/api';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

const parseCurrencyInput = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly ? Number(digitsOnly) : 0;
};

function CurrencyControl({ value, onChange, className = '', ...props }: Props) {
  return <input {...props} type="text" inputMode="numeric" autoComplete="off" value={formatIdr(value || 0)} onChange={(event) => onChange(parseCurrencyInput(event.target.value))} className={`h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${className}`} />;
}

export function CurrencyInput({ label, helperText, error, required, disabled, ...props }: Props) {
  if (!label) return <CurrencyControl {...props} disabled={disabled} />;
  return <FormField label={label} helperText={helperText} error={error} required={required} disabled={disabled}><CurrencyControl {...props} disabled={disabled} /></FormField>;
}
