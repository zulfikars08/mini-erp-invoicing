'use client';
import Link from 'next/link';
import { useEffect,useMemo,useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
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

export default function InvoicesPage(){
  const toast=useToast();
  const[rows,setRows]=useState<Invoice[]>([]);
  const[status,setStatus]=useState('');
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');
  const load=()=>{setLoading(true);setError('');api<Paginated<Invoice>>(`/invoices${status?`?status=${status}`:''}`).then(r=>setRows(r.data)).catch(()=>{const message='Failed to load invoice history.'; setError(message); toast({variant:'error',title:message});}).finally(()=>setLoading(false))};
  useEffect(()=>{load()},[status]);
  const {sortedItems,sortKey,direction,requestSort}=useSortableData(rows,(i,key)=>({number:i.invoiceNumber,customer:i.customer?.name,status:i.status,issue:new Date(i.issueDate),due:new Date(i.dueDate),total:Number(i.totalAmount)} as Record<string, any>)[key]);
  const actions=<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"><Select className="min-w-40" value={status} onChange={e=>setStatus(e.target.value)}>{statuses.map(s=><option key={s} value={s}>{s||'All status'}</option>)}</Select><Link href="/invoices/create"><Button className="w-full whitespace-nowrap px-4 sm:w-auto">+ Create Invoice</Button></Link></div>;
  return <div className="grid gap-6"><PageHeader title="Invoices" description="View invoices, open details, and update payment status." actions={actions}/>{error&&<ErrorMessage error={error}/>} {loading?<Loading/>:!sortedItems.length?<Empty text="No invoices match your filters."/>:<Table><thead><tr><Th><SortableHeader label="Number" sortKey="number" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Customer" sortKey="customer" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Status" sortKey="status" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Issue" sortKey="issue" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Due" sortKey="due" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th><SortableHeader label="Total" sortKey="total" currentSortKey={sortKey} direction={direction} onSort={requestSort}/></Th><Th>Actions</Th></tr></thead><tbody>{sortedItems.map(i=><tr key={i.id} className="hover:bg-slate-50"><Td><Link className="cursor-pointer font-semibold text-indigo-600 hover:underline" href={`/invoices/${i.id}`} title={`View invoice ${i.invoiceNumber}`} aria-label={`View invoice ${i.invoiceNumber}`}>{i.invoiceNumber}</Link></Td><Td>{i.customer?.name}</Td><Td><Badge status={i.status as InvoiceStatus}/></Td><Td>{fmtDate(i.issueDate)}</Td><Td>{fmtDate(i.dueDate)}</Td><Td>{formatIdr(i.totalAmount)}</Td><Td><Link href={`/invoices/${i.id}`} aria-label={`View invoice ${i.invoiceNumber}`} className="inline-flex rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100">View</Link></Td></tr>)}</tbody></Table>}</div>
}
