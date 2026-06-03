import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const priceId = process.env.STRIPE_PRICE_PRO_MONTHLY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!priceId || !appUrl || !process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe environment variables are missing" },
      { status: 500 }
    );
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: session.user.email,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard?payment=success`,
    cancel_url: `${appUrl}/dashboard?payment=cancelled`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
