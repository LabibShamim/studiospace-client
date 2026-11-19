"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { Edit3, Trash2, Plus, MapPin, LoaderCircle } from "lucide-react";

type Studio = { _id:string; title:string; category:string; imageUrl:string; location:string; hourlyRate:number };
export default function MyListingsPage() {
  const router=useRouter();
  const {data:session,isPending}=authClient.useSession();
  const [items,setItems]=useState<Studio[]>([]);
  const [loading,setLoading]=useState(true);
  const [deleting,setDeleting]=useState("");const [pendingDelete,setPendingDelete]=useState<Studio|null>(null);
  async function load(){try{setItems(await apiFetch<Studio[]>("/api/my/studios"));}catch(e){toast.error(e instanceof Error?e.message:"Could not load listings.");}finally{setLoading(false);}}
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{if(session?.user)load();else if(!isPending)setLoading(false);},[session,isPending]);
  async function remove(){if(!pendingDelete)return;const id=pendingDelete._id;setDeleting(id);try{await apiFetch(`/api/studios/${id}`,{method:"DELETE"});setItems(old=>old.filter(x=>x._id!==id));toast.success("Studio listing deleted.");setPendingDelete(null);}catch(e){toast.error(e instanceof Error?e.message:"Delete failed.");}finally{setDeleting("");}}
  if(isPending||loading)return <main className="mx-auto min-h-[60vh] max-w-6xl animate-pulse px-4 py-12"><div className="h-64 rounded-2xl bg-slate-200 dark:bg-zinc-800"/></main>;
  if(!session?.user)return <main className="mx-auto my-20 max-w-lg px-4 text-center"><h1 className="text-2xl font-bold dark:text-white">Sign in to view your listings</h1><button onClick={()=>router.push("/login?next=/my-listings")} className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">Sign in</button></main>;
  return <main className="min-h-[65vh] bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6"><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold tracking-[.2em] text-orange-500">HOST DASHBOARD</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">My studio listings</h1><p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Manage the creative spaces you have published.</p></div><Link href="/add-studio" className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white"><Plus size={17}/>Add a studio</Link></div>
  {items.length===0?<div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900"><h2 className="text-xl font-bold dark:text-white">No listings yet</h2><p className="mt-2 text-sm text-slate-500">Your published studios will appear here.</p><Link href="/add-studio" className="mt-5 inline-flex rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white">List your first studio</Link></div>:<div className="grid gap-5 md:grid-cols-2">{items.map(studio=><article key={studio._id} className="flex overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"><div className="relative w-36 shrink-0 sm:w-48"><Image src={studio.imageUrl||"/studiopic.jpg"} alt={studio.title} fill sizes="192px" className="object-cover"/></div><div className="flex min-w-0 flex-1 flex-col p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">{studio.category}</span><h2 className="mt-1 truncate font-bold text-slate-900 dark:text-white">{studio.title}</h2><p className="mt-2 flex items-center gap-1 truncate text-xs text-slate-500"><MapPin size={13}/>{studio.location}</p><p className="mt-2 text-sm font-bold text-orange-500">${studio.hourlyRate}/hr</p><div className="mt-auto flex gap-2 pt-4"><Link href={`/studios/edit/${studio._id}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-zinc-800 dark:text-white"><Edit3 size={13}/>Edit</Link><button onClick={()=>setPendingDelete(studio)} disabled={deleting===studio._id} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-50 dark:bg-red-500/10">{deleting===studio._id?<LoaderCircle size={13} className="animate-spin"/>:<Trash2 size={13}/>}Delete</button></div></div></article>)}</div>}</div>
  {pendingDelete&&<div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900"><div className="grid size-11 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10"><Trash2 size={20}/></div><h2 id="delete-title" className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Delete this studio?</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">“{pendingDelete.title}” will be permanently removed. Existing booking records will remain in your history.</p><div className="mt-6 flex justify-end gap-3"><button onClick={()=>setPendingDelete(null)} disabled={!!deleting} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-zinc-700 dark:text-white">Keep listing</button><button onClick={remove} disabled={!!deleting} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{deleting?"Deleting…":"Delete studio"}</button></div></div></div>}
 </main>;
}
