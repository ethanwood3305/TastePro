/**
 * Create a Stripe Checkout session for the user.
 * @returns {Promise<void>}
 */
export const createStripeCheckoutSession = async () => {
    try {
      // Call the backend API to create a Stripe Checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to create Stripe Checkout session");
      }
  
      const { url } = await response.json();
      window.location.href = url; // Redirect the user to the Stripe Checkout page
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  