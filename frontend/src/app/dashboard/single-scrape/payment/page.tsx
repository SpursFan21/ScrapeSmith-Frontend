// Frontend\frontend\src\app\dashboard\single-scrape\payment\page.tsx
// Frontend\frontend\src\app\dashboard\single-scrape\payment\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
}

const cardStyle = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: "Arial, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#a0aec0",
      },
    },
    invalid: {
      color: "#ff6b6b",
    },
  },
};

const PaymentForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const productId = "prod_S1CgJQ8HARLgRN"; // Your actual product ID

  useEffect(() => {
    axios
      .get(`http://localhost:8000/payment/product/${productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [productId]);

  const handlePayment = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/payment/create-payment-intent");

      const { clientSecret } = response.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("Payment successful!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setMessage("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-900">
      <div className="w-full max-w-lg p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">Payment</h2>
        {product ? (
          <div>
            <h3 className="text-xl font-semibold text-white">{product.name}</h3>
            <p className="text-gray-400 mb-4">{product.description}</p>
            <p className="text-lg text-amber-400 mb-4">
              Price: {product.price} {product.currency.toUpperCase()}
            </p>
            <form onSubmit={handlePayment}>
              <div className="p-3 mb-4 bg-gray-700 rounded">
                <CardElement options={cardStyle} />
              </div>
              <button
                type="submit"
                disabled={!stripe}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded w-full"
              >
                Pay Now
              </button>
            </form>
            {message && <p className="text-white mt-4">{message}</p>}
            {/* Stripe Branding */}
            <p className="text-gray-500 text-sm text-center mt-4">
              Payments securely processed by <span className="text-amber-500">Stripe</span>.
            </p>
          </div>
        ) : (
          <p className="text-gray-300">Loading product details...</p>
        )}
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;
