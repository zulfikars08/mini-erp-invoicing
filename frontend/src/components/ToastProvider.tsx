'use client';

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { Toast } from './Toast';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';
export type ToastInput = { title: string; message?: string; variant?: ToastVariant };
type ToastItem = ToastInput & { id: number; variant: ToastVariant };

const ToastContext = createContext<((toast: ToastInput) => void) | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const remove = useCallback((id: number) => setToasts((items) => items.filter((item) => item.id !== id)), []);
  const show = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = { ...toast, id, variant: toast.variant || 'info' };
    setToasts((items) => [...items, item]);
    window.setTimeout(() => remove(id), 3000);
  }, [remove]);
  const value = useMemo(() => show, [show]);

  return <ToastContext.Provider value={value}>{children}<div className="fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-4 sm:items-end">{toasts.map((toast) => <Toast key={toast.id} toast={toast} onClose={() => remove(toast.id)} />)}</div></ToastContext.Provider>;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
}
