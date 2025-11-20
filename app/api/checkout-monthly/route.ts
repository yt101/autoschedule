// app/api/checkout-monthly/route.ts

import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST() {
  try {
    const priceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_MONTHLY_PRICE_ID not configured" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing?canceled=true`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Stripe error" },
      { status: 500 }
    );
  }
}

