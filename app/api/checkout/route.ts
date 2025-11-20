// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json(); // "pro_monthly" | "pro_yearly"

    let priceId: string | undefined;

    if (plan === "pro_yearly") {
      priceId = process.env.STRIPE_YEARLY_PRICE_ID;
    } else {
      // default to monthly
      priceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price ID for selected plan" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // NO trial_period_days here
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Unknown Stripe error",
        details: err,
      },
      { status: 500 }
    );
  }
}
