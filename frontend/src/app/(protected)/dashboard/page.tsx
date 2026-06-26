'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { Empty, ErrorMessage, Loading } from '@/components/State';
import { Table, Td, Th } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { api, fmtDate, formatIdr } from '@/lib/api';
import { DashboardSummary } from '@/types';
import { useToast } from '@/hooks/useToast';

export default function DashboardPage(){ const toast=useToast(); const [data,setData]=useState<DashboardSummary>(); const [error,setError]=useState(''); useEffect(()=>{api<DashboardSummary>('/dashboard/summary').then(setData).catch(()=>{const message='Failed to load dashboard summary.'; setError(message); toast({variant:'error',title:message});});},[toast]); if(error)return <ErrorMessage error={error}/>; if(!data)return <Loading/>; const cards=[['Customers',data.totalCustomers],['Invoices',data.totalInvoices],['Paid',data.totalPaidInvoices],['Unpaid/Sent',data.totalUnpaidInvoices],['Revenue',formatIdr(data.totalRevenue)]]; return <div className="grid gap-6"><h1 className="text-2xl font-bold">Dashboard</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{cards.map(([k,v])=><Card key={k}><p className="text-sm text-slate-500">{k}</p><p className="mt-2 text-2xl font-bold">{v}</p></Card>)}</div><Card><h2 className="mb-4 font-semibold">Recent invoices</h2>{!data.recentInvoices.length?<Empty/>:<Table><thead><tr><Th>Number</Th><Th>Customer</Th><Th>Status</Th><Th>Date</Th><Th>Total</Th></tr></thead><tbody>{data.recentInvoices.map(i=><tr key={i.id}><Td><Link className="font-semibold" href={`/invoices/${i.id}`}>{i.invoiceNumber}</Link></Td><Td>{i.customer?.name}</Td><Td><Badge status={i.status}/></Td><Td>{fmtDate(i.issueDate)}</Td><Td>{formatIdr(i.totalAmount)}</Td></tr>)}</tbody></Table>}</Card></div> }
