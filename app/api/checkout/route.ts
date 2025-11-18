// app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    // Check for Stripe secret key first
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not set");
      return NextResponse.json(
        { error: "Stripe configuration error: STRIPE_SECRET_KEY is not set" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { plan } = body as { plan?: "monthly" | "yearly" };

    if (!plan) {
      return NextResponse.json(
        { error: "Missing plan" },
        { status: 400 }
      );
    }

    const monthlyPriceId = process.env.STRIPE_MONTHLY_PRICE_ID;
    const yearlyPriceId = process.env.STRIPE_YEARLY_PRICE_ID;

    if (!monthlyPriceId || !yearlyPriceId) {
      console.error("Missing price IDs:", { monthlyPriceId: !!monthlyPriceId, yearlyPriceId: !!yearlyPriceId });
      return NextResponse.json(
        { error: "Stripe price IDs not configured" },
        { status: 500 }
      );
    }

    const priceId = plan === "yearly" ? yearlyPriceId : monthlyPriceId;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // You configure the 3-day trial on the price in Stripe dashboard
      success_url: "https://sesametab.com/billing?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://sesametab.com/app",
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "No checkout URL returned from Stripe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error:", err);
    
    // Return more detailed error information in development
    const errorMessage = 
      process.env.NODE_ENV === "development"
        ? err?.message || err?.toString() || "Internal error"
        : "Internal error";
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? err : undefined
      },
      { status: 500 }
    );
  }
}

