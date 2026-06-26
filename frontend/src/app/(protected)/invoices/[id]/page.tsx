'use client';
import { use, useEffect, useState } from 'react';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Select } from '@/components/Select';
import { Empty, ErrorMessage, Loading } from '@/components/State';
import { Table,Td,Th } from '@/components/Table';
import { api, fmtDate, formatIdr } from '@/lib/api';
import { Invoice, InvoiceStatus } from '@/types';
import { useToast } from '@/hooks/useToast';

const statuses:InvoiceStatus[]=['DRAFT','SENT','PAID','CANCELLED','OVERDUE'];

export default function InvoiceDetailPage({params}:{params:Promise<{id:string}>}){
  const{id}=use(params); const toast=useToast(); const[invoice,setInvoice]=useState<Invoice>(); const[status,setStatus]=useState<InvoiceStatus>('DRAFT'); const[error,setError]=useState(''); const[busy,setBusy]=useState(false); const[pendingCancel,setPendingCancel]=useState(false);
  const load=()=>api<Invoice>(`/invoices/${id}`).then(data=>{setInvoice(data); setStatus(data.status as InvoiceStatus);}).catch(()=>{const message='Failed to load invoice detail.'; setError(message); toast({variant:'error',title:message});});
  useEffect(()=>{load()},[id]);
  async function update(nextStatus=status){if(!statuses.includes(nextStatus)){toast({variant:'error',title:'Invalid invoice status.'});return;} setBusy(true); setError(''); try{await api(`/invoices/${id}/status`,{method:'PATCH',body:JSON.stringify({status:nextStatus})}); toast({variant:'success',title:'Invoice status updated successfully.'}); await load();}catch{const message='Failed to update invoice status. Please try again.'; setError(message); toast({variant:'error',title:message});}finally{setBusy(false); setPendingCancel(false)}}
  function requestUpdate(){if(status==='CANCELLED')setPendingCancel(true); else update(status)}
  if(error&&!invoice)return <ErrorMessage error={error}/>; if(!invoice)return <Loading/>;
  return <div className="grid gap-6"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h1 className="text-2xl font-bold">{invoice.invoiceNumber}</h1><p className="text-sm text-slate-500">{invoice.customer?.name} · {fmtDate(invoice.issueDate)} - {fmtDate(invoice.dueDate)}</p></div><Badge status={invoice.status}/></div>{error&&<ErrorMessage error={error}/>}<Card><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="font-semibold text-slate-900">Update Status</h2><p className="text-sm text-slate-500">Change this invoice from draft to sent, paid, overdue, or cancelled.</p></div><div className="flex flex-col gap-2 sm:flex-row sm:items-center"><Select value={status} disabled={busy} onChange={e=>setStatus(e.target.value as InvoiceStatus)}>{statuses.map(s=><option key={s}>{s}</option>)}</Select><Button disabled={busy||status===invoice.status} onClick={requestUpdate}>{busy?'Updating...':'Update Status'}</Button></div></div></Card><Card><h2 className="mb-3 font-semibold">Invoice Items</h2>{!invoice.items?.length?<Empty/>:<Table><thead><tr><Th>Description</Th><Th>Qty</Th><Th>Unit Price</Th><Th>Total</Th></tr></thead><tbody>{invoice.items.map(it=><tr key={it.id}><Td>{it.description}</Td><Td>{it.quantity}</Td><Td>{formatIdr(it.unitPrice)}</Td><Td>{formatIdr(it.total)}</Td></tr>)}</tbody></Table>}<div className="mt-4 ml-auto grid max-w-xs gap-2 text-sm"><p className="flex justify-between"><span>Subtotal</span><b>{formatIdr(invoice.subtotal)}</b></p><p className="flex justify-between"><span>Tax</span><b>{formatIdr(invoice.taxAmount)}</b></p><p className="flex justify-between"><span>Discount</span><b>{formatIdr(invoice.discountAmount)}</b></p><p className="flex justify-between border-t pt-2 text-lg"><span>Total</span><b>{formatIdr(invoice.totalAmount)}</b></p></div></Card><ConfirmDialog open={pendingCancel} title="Cancel invoice?" description="This will mark the invoice as cancelled." confirmLabel="Cancel Invoice" cancelLabel="Cancel" variant="danger" loading={busy} onCancel={()=>setPendingCancel(false)} onConfirm={()=>update('CANCELLED')}/></div>
}
