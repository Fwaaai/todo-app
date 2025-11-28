import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center ">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-20 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">
          Random Todo App You Found On GitHub
        </h1>

        <div className="flex gap-4 justify-center mb-6">
          <Link href="/new-account">
            <button className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg">
              Create Account
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg">
              Login
            </button>
          </Link>
        </div>

        <p className="text-slate-200 leading-relaxed">
          This is a simple todo application built with a Next.js frontend and an
          Express.js backend. It features user authentication, allowing you to
          create an account and manage your tasks securely. Feel free to
          explore the code on{" "}
          <Link href="https://github.com/Fwaaai/todo-app" className="underline">
            GitHub
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
