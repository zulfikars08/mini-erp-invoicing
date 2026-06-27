'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { clearSession, getToken, getUser } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';

const nav = [['Dashboard','/dashboard'],['Customers','/customers'],['Invoices','/invoices'],['History','/invoices/history']];
export function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter(); const pathname=usePathname(); const toast=useToast(); const [ready,setReady]=useState(false); const user=getUser();
  useEffect(()=>{ if(!getToken()) router.replace('/login'); else setReady(true); },[router]);
  if(!ready) return <main className="p-6 text-sm text-slate-500">Loading...</main>;
  return <div className="min-h-screen bg-slate-50"><aside className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"><Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-950"><span className="grid h-9 w-9 place-items-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-slate-200"><Image src="/logo.png" alt="Mini ERP Invoicing logo" width={28} height={28} priority className="object-contain" /></span><span>Mini ERP</span></Link><nav className="hidden items-center gap-1 md:flex">{nav.map(([n,h])=>{const active=pathname===h || (h==='/invoices'&&pathname.startsWith('/invoices')&&pathname!=='/invoices/history'); return <Link key={h} href={h} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active?'bg-indigo-50 text-indigo-700':'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>{n}</Link>})}</nav><div className="flex items-center gap-3"><span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 sm:block">{user?.email}</span><button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={()=>{clearSession(); toast({variant:'success',title:'Signed out successfully.'}); router.replace('/login')}}>Logout</button></div></div><nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 md:hidden">{nav.map(([n,h])=><Link key={h} href={h} className={`rounded-lg px-3 py-2 text-sm font-medium ${pathname===h?'bg-indigo-50 text-indigo-700':'text-slate-600'}`}>{n}</Link>)}</nav></aside><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main></div>;
}
