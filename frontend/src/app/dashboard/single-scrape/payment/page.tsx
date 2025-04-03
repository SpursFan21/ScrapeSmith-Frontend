//Frontend\frontend\src\app\dashboard\single-scrape\payment\page.tsx
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<string | null>(null);
  const [customScript, setCustomScript] = useState<string | null>(null);

  const productId = "prod_S1CgJQ8HARLgRN";

  useEffect(() => {
    axios
      .get(`http://localhost:8000/payment/product/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error loading product:", err));

    setScrapeUrl(sessionStorage.getItem("scrapeUrl"));
    setAnalysisType(sessionStorage.getItem("analysisType"));
    setCustomScript(sessionStorage.getItem("customScript"));
  }, []);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !scrapeUrl || !analysisType) return;

    try {
      const paymentIntentRes = await axios.post(
        `http://localhost:8000/payment/create-payment-intent/${productId}`
      );

      const { clientSecret } = paymentIntentRes.data;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent?.status === "succeeded") {
        setMessage("✅ Payment successful! Your scrape has been submitted.");
        setOrderSuccess(true);

        const accessToken = localStorage.getItem("accessToken");
        await axios.post(
          "http://localhost:8000/scrape/single",
          { url: scrapeUrl, analysisType, customScript },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
    } catch (err) {
      console.error("Payment or scrape error:", err);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-900">
      <div className="w-full max-w-xl p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-white mb-6">Single Scrape Payment</h2>

        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h3 className="text-lg text-amber-400 font-semibold">Your Scrape Job</h3>
          <p className="text-white mt-2">
            <strong>URL:</strong> {scrapeUrl || "N/A"}
          </p>
          <p className="text-white">
            <strong>Analysis Type:</strong> {analysisType || "N/A"}
          </p>
        </div>

        {product ? (
          <div>
            <p className="text-xl text-white mb-2">{product.name}</p>
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
                disabled={!stripe || orderSuccess}
                className="bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded w-full"
              >
                Pay Now
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center font-medium text-white">{message}</p>
            )}

            {orderSuccess && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push("/dashboard/orders")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                >
                  View Order
                </button>
              </div>
            )}

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
