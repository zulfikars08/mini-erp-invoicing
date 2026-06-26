'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ErrorMessage } from '@/components/State';
import { Input } from '@/components/Input';
import { FormField } from '@/components/FormField';
import { api } from '@/lib/api';
import { setSession } from '@/lib/auth';
import { User } from '@/types';
import { useToast } from '@/hooks/useToast';

type Errors={email?:string;password?:string};
const isEmail=(value:string)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginPage(){
 const router=useRouter(); const toast=useToast();
 const [email,setEmail]=useState('admin@example.com'); const [password,setPassword]=useState('password123'); const [showPassword,setShowPassword]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [errors,setErrors]=useState<Errors>({});
 function validate(){const next:Errors={}; if(!email.trim())next.email='Email is required.'; else if(!isEmail(email))next.email='Enter a valid email address.'; if(!password)next.password='Password is required.'; else if(password.length<6)next.password='Password must be at least 6 characters.'; setErrors(next); return !Object.keys(next).length;}
 async function submit(e:FormEvent){e.preventDefault(); if(!validate())return; setLoading(true); setError(''); try{const res=await api<{accessToken:string; user:User}>('/auth/login',{method:'POST',auth:false,body:JSON.stringify({email,password})}); setSession(res.accessToken,res.user); toast({variant:'success',title:'Signed in successfully.'}); router.replace('/dashboard');}catch(err){const message=err instanceof Error&&err.message?err.message:'Invalid email or password.'; setError(message); toast({variant:'error',title:message});}finally{setLoading(false)}}
 return <main className="grid min-h-screen place-items-center bg-slate-100 p-4"><Card className="w-full max-w-md"><h1 className="text-2xl font-bold">Mini ERP Login</h1><p className="mt-1 text-sm text-slate-500">Use seeded admin account.</p><form onSubmit={submit} className="mt-6 grid gap-4" noValidate>{error&&<ErrorMessage error={error}/>}<FormField label="Email" required helperText="Enter your account email address." error={errors.email}><Input value={email} onChange={e=>{setEmail(e.target.value); setErrors({...errors,email:undefined})}} type="email" disabled={loading}/></FormField><FormField label="Password" required helperText="Enter your password." error={errors.password}><div className="relative"><Input className="pr-16" value={password} onChange={e=>{setPassword(e.target.value); setErrors({...errors,password:undefined})}} type={showPassword?'text':'password'} disabled={loading}/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(value=>!value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-sm font-medium text-slate-500 outline-none hover:text-slate-700 focus:ring-2 focus:ring-indigo-500">{showPassword?'Hide':'Show'}</button></div></FormField><Button disabled={loading}>{loading?'Signing in...':'Login'}</Button></form></Card></main>
}
