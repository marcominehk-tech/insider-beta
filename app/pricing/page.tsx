import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CheckoutButton from "@/components/checkout-button";

export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-white/50">
          Pricing
        </p>

        <h1 className="mt-4 text-4xl font-bold md:text-5xl">
          選擇你的會員方案
        </h1>

        <p className="mt-4 max-w-2xl text-white/70">
          這一頁會連到 Stripe Checkout，之後你可以把 Pro 
月費方案接成真正付款。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 
p-6">
            <h2 className="text-2xl font-semibold">Free</h2>
            <p className="mt-3 text-white/70">瀏覽公開內容</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 
p-6">
            <h2 className="text-2xl font-semibold">Pro</h2>
            <p className="mt-3 text-white/70">月費訂閱完整會員功能</p>
            <div className="mt-6">
              <CheckoutButton />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 
p-6">
            <h2 className="text-2xl font-semibold">Elite</h2>
            <p className="mt-3 text-white/70">高級會員與未來進階功能</p>
          </div>
        </div>
      </section>
    </main>
  );
}
