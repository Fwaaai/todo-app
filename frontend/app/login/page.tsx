import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-20 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-6 drop-shadow">
          Login to Your Account
        </h1>

        <form className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur-lg"
          />

          <button
            type="submit"
            className="mt-4 px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold transition backdrop-blur-lg shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-slate-200">
          Don’t have an account?{" "}
          <Link href="/new-account">
            <span className="text-white font-semibold hover:underline cursor-pointer">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
