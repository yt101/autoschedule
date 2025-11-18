// app/billing/page.tsx

import { stripe } from "@/lib/stripe";

type BillingPageProps = {
  searchParams: {
    session_id?: string;
  };
};

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const sessionId = searchParams.session_id;

  let title = "Billing";
  let message =
    "We couldn't find a Stripe session. If you just completed checkout, please check your email for a receipt.";
  let isPro = false;

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      const status = session.status;
      const paymentStatus = session.payment_status;

      const isPaid =
        paymentStatus === "paid" || status === "complete" || status === "paid";

      if (isPaid) {
        title = "You're Pro ✨";
        message =
          "Your payment was successful. You now have access to SesameTab Pro features on this browser. You can safely close this tab or go back to your ritual.";
        isPro = true;
      } else {
        title = "Payment not completed";
        message =
          "We found your Stripe session, but the payment is not marked as completed yet. If this seems wrong, refresh in a few seconds or contact support.";
      }
    } catch (err) {
      console.error("Error retrieving Stripe session:", err);
      title = "Something went wrong";
      message =
        "We couldn't verify your payment session. If you just completed checkout, please wait a moment and refresh, or contact support with your receipt.";
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute top-40 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-xl font-semibold mb-2">{title}</h1>

        <p className="text-sm text-slate-300">{message}</p>

        {isPro && (
          <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
            SesameTab doesn&apos;t use full accounts yet, so Pro is recognized on
            this browser/session. In the future, you&apos;ll be able to link this
            to an email login.
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 text-sm">
          <a
            href="/app"
            className="inline-flex w-full items-center justify-center rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-amber-400/40 hover:bg-amber-300"
          >
            Back to SesameTab
          </a>
          <a
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 px-4 py-2 text-xs font-medium text-slate-100 hover:border-amber-400 hover:text-amber-200"
          >
            Go to homepage
          </a>
        </div>

        {sessionId && (
          <p className="mt-3 text-[10px] text-slate-500">
            Session ID: <span className="font-mono">{sessionId}</span>
          </p>
        )}
      </div>
    </main>
  );
}

