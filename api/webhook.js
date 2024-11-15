// api/webhook.js
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { buffer } from "micro";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export const config = {
  api: {
    bodyParser: false, // Disables default body parser for raw body handling
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      const buf = await buffer(req); // Buffer the request for Stripe signature verification
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error("Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        await handleSubscription(session);
        break;
      // Add more Stripe events here as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleSubscription(session) {
  const { customer, subscription, metadata } = session;
  const userId = metadata.userId;

  const { data, error } = await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_customer_id: customer,
      stripe_subscription_id: subscription,
      status: "active",
    });

  if (error) {
    console.error("Error updating subscription in Supabase:", error.message);
  } else {
    console.log("Subscription updated in Supabase:", data);
  }
}
