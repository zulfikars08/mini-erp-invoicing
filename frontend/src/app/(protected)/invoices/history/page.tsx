'use client';
import Link from 'next/link';
import { useEffect,useMemo,useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { PageHeader } from '@/components/PageHeader';
import { Select } from '@/components/Select';
import { SortableHeader } from '@/components/SortableHeader';
import { Empty, ErrorMessage, Loading } from '@/components/State';
import { Table,Td,Th } from '@/components/Table';
import { api, fmtDate, formatIdr } from '@/lib/api';
import { Invoice, InvoiceStatus, Paginated } from '@/types';
import { useToast } from '@/hooks/useToast';
import { useSortableData } from '@/hooks/useSortableData';

const statuses=['','DRAFT','SENT','PAID','CANCELLED','OVERDUE'];
const activityDate=(invoice:Invoice)=>invoice.updatedAt || invoice.createdAt || invoice.issueDate;

export default function InvoiceHistoryPage(){
  const toast=useToast(); const[rows,setRows]=useState<Invoice[]>([]); const[status,setStatus]=useState(''); const[loading,setLoading]=useState(true); const[error,setError]=useState('');
  const load=()=>{setLoading(true);setError('');api<Paginated<Invoice>>(`/invoices${status?`?status=${status}`:''}`).then(r=>setRows(r.data)).catch(()=>{const message='Failed to load invoice history.'; setError(message); toast({variant:'error',title:message});}).finally(()=>setLoading(false))};
  useEffect(()=>{load()},[status]);
  const defaultRows=useMemo(()=>[...rows].sort((a,b)=>new Date(activityDate(b)).getTime()-new Date(activityDate(a)).getTime()),[rows]);
  const {sortedItems,sortKey,direction,requestSort}=useSortableData(defaultRows,(i,key)=>({number:i.invoiceNumber,customer:i.customer?.name,status:i.status,issue:new Date(i.issueDate),due:new Date(i.dueDate),total:Number(i.totalAmount),updated:new Date(activityDate(i))} as Record<string, any>)[key]);
  const actions=<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"><Select aria-label="Filter by status" className="min-w-40" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s||'All status'}</option>)}</Select><Link href="/invoices"><Button className="w-full whitespace-nowrap border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 sm:w-auto">Back to Invoices</Button></Link></div>;
  return <div className="grid gap-6"><PageHeader title="Invoice History" description="Review invoice records ordered by latest activity." actions={actions}/><Card className="border-indigo-100 bg-indigo-50/40"><p className="text-sm text-indigo-900"><span className="font-semibold">Note:</span> Status audit logs are not stored separately yet. This page shows invoice records ordered by latest update.</p></Card>{error&&<ErrorMessage error={error}/>} {loading?<Loading/>:!sortedItems.length?<div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center"><p className="font-semibold text-slate-950">No invoice history matches your filters.</p><p className="mt-1 text-sm text-slate-500">Invoice records will appear here after invoices are created.</p><Link href="/invoices" className="mt-4 inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to Invoices</Link></div>:<Table><thead><tr><Th><SortableHeader label="Invoice Number" sortKey="number" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Customer" sortKey="customer" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Current Status" sortKey="status" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Issue Date" sortKey="issue" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Due Date" sortKey="due" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Total" sortKey="total" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Last Updated" sortKey="updated" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th>Actions</Th></tr></thead><tbody>{sortedItems.map(i=><tr key={i.id} className="hover:bg-slate-50"><Td><Link className="cursor-pointer font-semibold text-indigo-600 hover:underline" href={`/invoices/${i.id}`} title={`View invoice ${i.invoiceNumber}`} aria-label={`View invoice ${i.invoiceNumber}`}>{i.invoiceNumber}</Link></Td><Td>{i.customer?.name}</Td><Td><Badge status={i.status as InvoiceStatus}/></Td><Td>{fmtDate(i.issueDate)}</Td><Td>{fmtDate(i.dueDate)}</Td><Td>{formatIdr(i.totalAmount)}</Td><Td>{fmtDate(activityDate(i))}</Td><Td><Link href={`/invoices/${i.id}`} aria-label={`View invoice ${i.invoiceNumber}`} className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">View</Link></Td></tr>)}</tbody></Table>}</div>
}
