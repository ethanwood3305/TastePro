import { supabase } from "../supabase";

/**
 * Check if the user has an active subscription.
 * @returns {Promise<boolean>} Whether the user has an active subscription.
 */
export const hasActiveSubscription = async () => {
  const user = supabase.auth.user;

  if (!user) return false;

  // Query the subscriptions table for active status
  const { data, error } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error || data.length === 0) {
    console.error("Error checking subscription status:", error);
    return false;
  }

  return true;
};

/**
 * Log out the current user.
 */
export const logout = async () => {
  await supabase.auth.signOut();
  window.location.reload();
};
