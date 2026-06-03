"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-white/10 bg-black/80 
backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between 
px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-[0.2em]">
          INSIDER BETA
        </Link>

        <nav className="flex items-center gap-4 text-sm text-white/70">
          <Link href="/" className="transition hover:text-white">
            首頁
          </Link>

          {session?.user ? (
            <>
              <span className="hidden text-white/60 md:inline">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-full border border-white/20 px-4 py-1.5 
font-medium transition hover:bg-white hover:text-black"
              >
                登出
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/20 px-4 py-1.5 
font-medium transition hover:bg-white hover:text-black"
            >
              會員登入
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

