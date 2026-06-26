export function Loading() { return <p className="p-6 text-sm text-slate-500">Loading...</p>; }
export function Empty({ text='No data' }: { text?: string }) { return <p className="rounded-xl border border-dashed p-6 text-center text-sm text-slate-500">{text}</p>; }
export function ErrorMessage({ error }: { error: string }) { return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>; }
