import { supabaseClient as supabase } from './supabase';

// This should be stored in an environment variable in a real application
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51HobbFClNNnPaV4q5lbtT7SgHkYpA5hX5b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z';

// Make Stripe global type available
declare const Stripe: any;

let stripePromise: Promise<any> | null = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = new Promise((resolve) => {
      // It's safe to call loadStripe multiple times. It'll always return the same object.
      const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
      resolve(stripe);
    });
  }
  return stripePromise;
};

/**
 * Creates a Stripe Checkout session and redirects the user.
 * This function invokes a Supabase Edge Function named 'stripe-checkout'.
 * @param priceId The ID of the Stripe Price object.
 */
export const redirectToCheckout = async (priceId: string): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { 
        priceId,
        returnUrl: `${window.location.origin}/#/app/billing?session_id={CHECKOUT_SESSION_ID}`
      },
    });

    if (error) throw error;
    if (!data.sessionId) throw new Error("Could not retrieve a checkout session.");

    const stripe = await getStripe();
    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (stripeError) {
        console.error("Stripe redirection error:", stripeError);
        throw stripeError;
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw new Error('An unexpected error occurred. Please try again.');
  }
};


/**
 * Creates a Stripe Customer Portal session and redirects the user.
 * This function invokes a Supabase Edge Function named 'stripe-portal'.
 */
export const redirectToBillingPortal = async (): Promise<void> => {
    try {
        const { data, error } = await supabase.functions.invoke('stripe-portal', {
            body: {
                returnUrl: `${window.location.origin}/#/app/billing`
            }
        });

        if (error) throw error;
        if (!data.url) throw new Error("Could not retrieve billing portal URL.");
        
        window.location.assign(data.url);

    } catch (error) {
        console.error('Error redirecting to billing portal:', error);
        throw new Error('Could not open billing portal. Please try again.');
    }
}
