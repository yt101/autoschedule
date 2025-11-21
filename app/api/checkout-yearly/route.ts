// app/api/checkout-yearly/route.ts

import { NextResponse } from "next/server";

import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);



export async function POST() {

  try {

    const session = await stripe.checkout.sessions.create({

      mode: "subscription",

      line_items: [

        {

          price: process.env.STRIPE_YEARLY_PRICE_ID!,

          quantity: 1,

        },

      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/login?checkout=success`,

      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,

    });



    return NextResponse.json({ url: session.url });

  } catch (err: any) {

    console.error("Stripe checkout error:", err);

    return NextResponse.json(

      { error: "Unable to create checkout session" },

      { status: 500 }

    );

  }

}

