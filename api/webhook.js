const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event) {
  const sig = event.headers["stripe-signature"];
  const headers = {
    "Access-Control-Allow-Origin": "*", // Adjust as needed
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  let stripeEvent;

  try {
    // Pass the raw body for Stripe signature verification
    stripeEvent = stripe.webhooks.constructEvent(
      event.body, // RAW body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, headers, body: `Webhook Error: ${err.message}` };
  }

  // Handle the checkout session completed event
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    // Process the subscription update
    console.log("Checkout session completed:", session);
    await updateSubscriptionStatus(session.metadata.userId, session.subscription);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true }),
  };
};

const updateSubscriptionStatus = async (userId, subscriptionId) => {
  console.log(`Updating subscription for user: ${userId}`);
  // Add your database update logic here
  // Example for Supabase:
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      status: "active",
    });

  if (error) {
    console.error("Error updating subscription:", error);
  } else {
    console.log("Subscription updated successfully:", data);
  }
};
