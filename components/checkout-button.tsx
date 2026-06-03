"use client";

import { useState } from "react";

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("No checkout URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="rounded-full bg-white px-6 py-3 text-sm font-semibold 
text-black transition hover:bg-white/90 disabled:opacity-50"
      >
        {loading ? "前往付款中..." : "訂閱 Pro"}
      </button>

      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : 
null}
    </div>
  );
}
