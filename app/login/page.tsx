"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError("Email 或密碼錯誤");
      return;
    }

    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col 
justify-center px-6 py-20">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit text-sm text-white/60 
transition hover:text-white"
        >
          ← 返回首頁
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 
shadow-2xl">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.2em] 
text-white/50">
              Member Login
            </p>
            <h1 className="mt-3 text-3xl font-bold">登入你的帳戶</h1>
            <p className="mt-3 text-white/70">
              請使用你設定在 .env 裡的管理員帳號登入。
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm 
text-white/80">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 
bg-black/40 px-4 py-3 text-white outline-none transition 
placeholder:text-white/30 focus:border-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm 
text-white/80">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 
bg-black/40 px-4 py-3 text-white outline-none transition 
placeholder:text-white/30 focus:border-white/30"
              />
            </div>

            {error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-2xl bg-white px-4 py-3 
font-semibold text-black transition hover:bg-white/90"
            >
              登入
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

