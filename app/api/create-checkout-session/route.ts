// app/api/create-checkout-session/route.ts

import { NextResponse } from "next/server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { priceId } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/login?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
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
