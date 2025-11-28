import Link from "next/link" // or next/link depending on your setup

export function Sidebar() {
  return (
    <aside className="sticky top-0 h-screen">
      <div className="h-full w-64 overflow-y-auto bg-slate-900/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col gap-6 text-white">
        <h2 className="text-2xl font-semibold">Menu</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <Link className="hover:text-slate-300 transition" href="/me/profile">Profile</Link>
          <Link className="hover:text-slate-300 transition" href="/me/account">Account Settings</Link>
          <Link className="hover:text-slate-300 transition" href="/me/todos">My Todos</Link>
          <Link className="hover:text-slate-300 transition" href="/me/logout">Logout</Link>
        </nav>
      </div>
    </aside>
  );
}
