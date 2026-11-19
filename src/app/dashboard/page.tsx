"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Building2, CalendarDays, PlusCircle } from "lucide-react";
export default function DashboardPage(){
 const {data:session,isPending}=authClient.useSession();
 if(isPending)return <main className="min-h-[60vh] animate-pulse p-10"><div className="mx-auto h-56 max-w-5xl rounded-2xl bg-slate-200 dark:bg-zinc-800"/></main>;
 if(!session?.user)return <main className="py-20 text-center dark:text-white">Please <Link className="text-orange-500" href="/login?next=/dashboard">sign in</Link> to open your dashboard.</main>;
 const links=[{href:"/my-listings",title:"My Studio Listings",desc:"Update your published creative spaces.",icon:Building2},{href:"/my-bookings",title:"My Bookings",desc:"Track reservations as a creator or host.",icon:CalendarDays},{href:"/add-studio",title:"Add New Studio",desc:"Publish a space and connect with creators.",icon:PlusCircle}];
 return <main className="min-h-[65vh] bg-slate-50 px-4 py-14 dark:bg-zinc-950"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold tracking-widest text-orange-500">YOUR WORKSPACE</p><h1 className="mt-2 text-3xl font-extrabold dark:text-white">Welcome, {session.user.name}</h1><p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Your creative activity, all in one place.</p><div className="mt-8 grid gap-5 md:grid-cols-3">{links.map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-orange-300 dark:border-zinc-800 dark:bg-zinc-900"><div className="grid size-12 place-items-center rounded-xl bg-orange-50 text-orange-500 dark:bg-orange-500/10"><Icon size={22}/></div><h2 className="mt-5 font-bold dark:text-white">{item.title}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-zinc-400">{item.desc}</p></Link>})}</div></div></main>;
}
