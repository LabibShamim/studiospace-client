"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import toast from "react-hot-toast";
import { UploadCloud, LoaderCircle } from "lucide-react";

const categories = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop", "Creative Space"];
const amenityOptions = ["Professional lighting", "Soundproofing", "Green screen", "Cyclorama wall", "Camera equipment", "Audio console", "Makeup station", "Wi-Fi", "Parking", "Air conditioning"];

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title:"", category:categories[0], hourlyRate:"", securityDeposit:"0", maxCapacity:"1", location:"", imageUrl:"", overview:"" });
  const [amenities, setAmenities] = useState<string[]>([]);
  const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white";

  if (isPending) return <div className="mx-auto min-h-[60vh] max-w-3xl animate-pulse p-10"><div className="h-80 rounded-2xl bg-slate-200 dark:bg-zinc-800"/></div>;
  if (!session?.user) return <div className="mx-auto my-20 max-w-lg rounded-2xl border p-8 text-center dark:border-zinc-800"><h1 className="text-2xl font-bold dark:text-white">Sign in required</h1><p className="mt-2 text-sm text-slate-500">Please sign in to list your creative space.</p><button onClick={()=>router.push("/login?next=/add-studio")} className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">Go to Login</button></div>;

  async function uploadFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) { toast.error("Choose an image under 5 MB."); return; }
    setUploading(true);
    try {
      const base64 = await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result).split(",")[1]);reader.onerror=reject;reader.readAsDataURL(file);});
      const result = await apiFetch<{url:string}>("/api/upload",{method:"POST",body:JSON.stringify({image:base64})});
      setForm(old=>({...old,imageUrl:result.url}));
      toast.success("Image uploaded.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Image upload failed."); }
    finally { setUploading(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/studios",{method:"POST",body:JSON.stringify({...form,hourlyRate:Number(form.hourlyRate),securityDeposit:Number(form.securityDeposit),maxCapacity:Number(form.maxCapacity),amenities})});
      toast.success("Your studio is now listed.");
      router.push("/my-listings");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not publish this studio."); }
    finally { setLoading(false); }
  }

  return <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-zinc-950 sm:px-6">
    <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-10">
      <p className="text-xs font-bold tracking-[.2em] text-orange-500">HOST PORTAL</p><h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">List your creative space</h1><p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Share your studio with creators and turn available hours into opportunity.</p>
      <form onSubmit={submit} className="mt-8 space-y-5">
        <label className="block text-sm font-semibold dark:text-zinc-200">Studio title<input required minLength={4} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Northlight Photography Loft" className={`${inputClass} mt-2`}/></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold dark:text-zinc-200">Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className={`${inputClass} mt-2`}>{categories.map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="block text-sm font-semibold dark:text-zinc-200">Location / address<input required value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="City, neighborhood" className={`${inputClass} mt-2`}/></label>
          <label className="block text-sm font-semibold dark:text-zinc-200">Hourly rate ($)<input required type="number" min="1" value={form.hourlyRate} onChange={e=>setForm({...form,hourlyRate:e.target.value})} className={`${inputClass} mt-2`}/></label>
          <label className="block text-sm font-semibold dark:text-zinc-200">Refundable security deposit ($)<input type="number" min="0" value={form.securityDeposit} onChange={e=>setForm({...form,securityDeposit:e.target.value})} className={`${inputClass} mt-2`}/></label>
          <label className="block text-sm font-semibold dark:text-zinc-200">Maximum capacity<input required type="number" min="1" value={form.maxCapacity} onChange={e=>setForm({...form,maxCapacity:e.target.value})} className={`${inputClass} mt-2`}/></label>
          <div><label className="block text-sm font-semibold dark:text-zinc-200">Studio image</label><div className="mt-2 flex gap-2"><input type="url" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} placeholder="Paste image URL" className={inputClass}/><label className="grid shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 px-4 text-orange-500 dark:border-zinc-700"><UploadCloud size={20}/><input type="file" accept="image/*" className="hidden" onChange={e=>uploadFile(e.target.files?.[0])}/></label></div>{uploading&&<p className="mt-1 text-xs text-orange-500">Uploading image…</p>}</div>
        </div>
        <fieldset><legend className="mb-3 text-sm font-semibold dark:text-zinc-200">Amenities & equipment</legend><div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{amenityOptions.map(item=><label key={item} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-600 dark:border-zinc-700 dark:text-zinc-300"><input type="checkbox" checked={amenities.includes(item)} onChange={e=>setAmenities(old=>e.target.checked?[...old,item]:old.filter(x=>x!==item))} className="accent-orange-500"/>{item}</label>)}</div></fieldset>
        <label className="block text-sm font-semibold dark:text-zinc-200">Detailed overview<textarea required minLength={30} rows={5} value={form.overview} onChange={e=>setForm({...form,overview:e.target.value})} placeholder="Describe the space, equipment, access, and ideal use cases…" className={`${inputClass} mt-2 resize-y`}/></label>
        <div className="grid gap-4 rounded-xl bg-slate-50 p-4 dark:bg-zinc-800 sm:grid-cols-2"><div><p className="text-[10px] font-bold text-slate-400">HOST NAME</p><p className="mt-1 text-sm font-semibold dark:text-white">{session.user.name}</p></div><div><p className="text-[10px] font-bold text-slate-400">HOST EMAIL</p><p className="mt-1 text-sm font-semibold dark:text-white">{session.user.email}</p></div></div>
        <button disabled={loading||uploading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-4 font-bold text-white hover:bg-orange-600 disabled:opacity-60">{(loading||uploading)&&<LoaderCircle className="animate-spin" size={18}/>}Publish studio listing</button>
      </form>
    </div>
  </main>;
}
