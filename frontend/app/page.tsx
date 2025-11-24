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
          <button className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg">
            Login
          </button>
        </div>

        <p className="text-slate-200 leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac
          scelerisque libero. Vestibulum euismod, nisl eget consectetur
          elementum, nunc nisl aliquam nunc, eget consequat lorem ipsum in
          massa.
        </p>
      </div>
    </div>
  );
}
