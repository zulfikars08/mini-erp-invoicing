'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { clearSession, getToken, getUser } from '@/lib/auth';
import { useToast } from '@/hooks/useToast';

const nav = [['Dashboard','/dashboard'],['Customers','/customers'],['Invoices','/invoices'],['History','/invoices/history']];
export function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter(); const toast=useToast(); const [ready,setReady]=useState(false); const user=getUser();
  useEffect(()=>{ if(!getToken()) router.replace('/login'); else setReady(true); },[router]);
  if(!ready) return <main className="p-6 text-sm text-slate-500">Loading...</main>;
  return <div className="min-h-screen bg-slate-50"><aside className="fixed inset-x-0 top-0 z-10 border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between p-4"><Link href="/dashboard" className="font-bold">Mini ERP</Link><nav className="hidden gap-4 md:flex">{nav.map(([n,h])=><Link key={h} href={h} className="text-sm text-slate-600 hover:text-slate-950">{n}</Link>)}</nav><div className="flex items-center gap-3"><span className="hidden text-xs text-slate-500 sm:block">{user?.email}</span><button className="text-sm font-semibold" onClick={()=>{clearSession(); toast({variant:'success',title:'Signed out successfully.'}); router.replace('/login')}}>Logout</button></div></div></aside><main className="mx-auto max-w-6xl px-4 pb-10 pt-24">{children}</main></div>;
}
