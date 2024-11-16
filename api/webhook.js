const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Adjust for your frontend URL
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

  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    // Update user's subscription status in your database
    await updateSubscriptionStatus(session.metadata.userId, session.subscription);
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ received: true }),
  };
};

const updateSubscriptionStatus = async (userId, subscriptionId) => {
  // Replace this with your database update logic
  console.log(`Updating subscription for user ${userId} with subscription ${subscriptionId}`);
  // Example with Supabase:
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
