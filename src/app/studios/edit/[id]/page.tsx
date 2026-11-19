"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";

const categories=["Photo Studio","Film Stage","Podcast Lounge","Music Suite","Workshop","Creative Space"];
export default function EditStudioPage(){
 const {id}=useParams<{id:string}>();const router=useRouter();const {data:session,isPending}=authClient.useSession();
 const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);
 const [form,setForm]=useState({title:"",category:categories[0],hourlyRate:"",securityDeposit:"0",maxCapacity:"1",location:"",imageUrl:"",overview:""});
 const [amenities,setAmenities]=useState<string[]>([]);
 useEffect(()=>{if(!session?.user||!id)return;apiFetch<any[]>("/api/my/studios").then(list=>{const item=list.find(x=>x._id===id);if(!item)throw new Error("Studio not found or access denied.");setForm({title:item.title||"",category:item.category||categories[0],hourlyRate:String(item.hourlyRate||""),securityDeposit:String(item.securityDeposit||0),maxCapacity:String(item.maxCapacity||1),location:item.location||"",imageUrl:item.imageUrl||"",overview:item.overview||""});setAmenities(item.amenities||[]);}).catch(e=>toast.error(e instanceof Error?e.message:"Could not load studio.")).finally(()=>setLoading(false));},[session,id]);
 async function submit(e:FormEvent){e.preventDefault();setSaving(true);try{await apiFetch(`/api/studios/${id}`,{method:"PUT",body:JSON.stringify({...form,hourlyRate:Number(form.hourlyRate),securityDeposit:Number(form.securityDeposit),maxCapacity:Number(form.maxCapacity),amenities})});toast.success("Studio updated.");router.push("/my-listings");}catch(e){toast.error(e instanceof Error?e.message:"Update failed.");}finally{setSaving(false);}}
 const cls="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";
 if(isPending||loading)return <main className="min-h-[60vh] animate-pulse p-10"><div className="mx-auto h-96 max-w-3xl rounded-2xl bg-slate-200 dark:bg-zinc-800"/></main>;
 if(!session?.user)return <main className="py-20 text-center dark:text-white">Please <Link className="text-orange-500" href="/login">sign in</Link> to edit a studio.</main>;
 return <main className="bg-slate-50 px-4 py-12 dark:bg-zinc-950"><div className="mx-auto max-w-3xl rounded-3xl border bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900 sm:p-10"><p className="text-xs font-bold tracking-widest text-orange-500">HOST PORTAL</p><h1 className="mt-2 text-3xl font-extrabold dark:text-white">Update studio</h1><form onSubmit={submit} className="mt-7 space-y-5">
 <label className="block text-sm font-semibold dark:text-zinc-200">Title<input required className={cls} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
 <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold dark:text-zinc-200">Category<select className={cls} value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{categories.map(x=><option key={x}>{x}</option>)}</select></label><label className="text-sm font-semibold dark:text-zinc-200">Location<input required className={cls} value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><label className="text-sm font-semibold dark:text-zinc-200">Hourly rate<input required type="number" min="1" className={cls} value={form.hourlyRate} onChange={e=>setForm({...form,hourlyRate:e.target.value})}/></label><label className="text-sm font-semibold dark:text-zinc-200">Security deposit<input type="number" min="0" className={cls} value={form.securityDeposit} onChange={e=>setForm({...form,securityDeposit:e.target.value})}/></label><label className="text-sm font-semibold dark:text-zinc-200">Max capacity<input type="number" min="1" className={cls} value={form.maxCapacity} onChange={e=>setForm({...form,maxCapacity:e.target.value})}/></label><label className="text-sm font-semibold dark:text-zinc-200">Image URL<input type="url" className={cls} value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})}/></label></div>
 <label className="block text-sm font-semibold dark:text-zinc-200">Overview<textarea rows={5} required className={cls} value={form.overview} onChange={e=>setForm({...form,overview:e.target.value})}/></label>
 <label className="block text-sm font-semibold dark:text-zinc-200">Amenities (comma separated)<input className={cls} value={amenities.join(", ")} onChange={e=>setAmenities(e.target.value.split(",").map(x=>x.trim()).filter(Boolean))}/></label>
 <div className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500 dark:bg-zinc-800 dark:text-zinc-300">Host: {session.user.name} · {session.user.email}</div>
 <button disabled={saving} className="w-full rounded-xl bg-orange-500 py-4 font-bold text-white disabled:opacity-50">{saving?"Saving changes…":"Save changes"}</button>
 </form></div></main>;
}
