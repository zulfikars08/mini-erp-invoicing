'use client';
import Link from 'next/link';
import { useEffect,useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { Empty, ErrorMessage, Loading } from '@/components/State';
import { Table,Td,Th } from '@/components/Table';
import { api, fmtDate, formatIdr } from '@/lib/api';
import { Invoice, InvoiceStatus, Paginated } from '@/types';
import { useToast } from '@/hooks/useToast';

const statuses=['','DRAFT','SENT','PAID','CANCELLED','OVERDUE'];

export default function InvoicesPage(){
  const toast=useToast();
  const[rows,setRows]=useState<Invoice[]>([]);
  const[status,setStatus]=useState('');
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');
  const load=()=>{setLoading(true);setError('');api<Paginated<Invoice>>(`/invoices${status?`?status=${status}`:''}`).then(r=>setRows(r.data)).catch(()=>{const message='Failed to load invoice history.'; setError(message); toast({variant:'error',title:message});}).finally(()=>setLoading(false))};
  useEffect(()=>{load()},[status]);
  return <div className="grid gap-6"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h1 className="text-2xl font-bold">Invoices</h1><p className="mt-1 text-sm text-slate-500">View invoices, open details, and update payment status.</p></div><div className="flex gap-2"><Select value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s||'All status'}</option>)}</Select><Link href="/invoices/create"><Button>Create invoice</Button></Link></div></div>{error&&<ErrorMessage error={error}/>} {loading?<Loading/>:!rows.length?<Empty text="No invoices"/>:<Table><thead><tr><Th>Number</Th><Th>Customer</Th><Th>Status</Th><Th>Issue</Th><Th>Due</Th><Th>Total</Th><Th>Actions</Th></tr></thead><tbody>{rows.map(i=><tr key={i.id} className="hover:bg-slate-50"><Td><Link className="cursor-pointer font-semibold text-indigo-600 hover:underline" href={`/invoices/${i.id}`} title={`View invoice ${i.invoiceNumber}`} aria-label={`View invoice ${i.invoiceNumber}`}>{i.invoiceNumber}</Link></Td><Td>{i.customer?.name}</Td><Td><Badge status={i.status as InvoiceStatus}/></Td><Td>{fmtDate(i.issueDate)}</Td><Td>{fmtDate(i.dueDate)}</Td><Td>{formatIdr(i.totalAmount)}</Td><Td><Link href={`/invoices/${i.id}`} aria-label={`View invoice ${i.invoiceNumber}`} className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">View</Link></Td></tr>)}</tbody></Table>}</div>
}
