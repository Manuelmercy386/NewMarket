import React, { useEffect, useState } from 'react';
import { CheckCircle2, LoaderCircle, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';

export const PaymentCallbackPage = ({ onNavigate }) => {
  const reference = new URLSearchParams(window.location.search).get('reference');
  const { clearCart, setOrders } = useCart();
  const [state, setState] = useState({ loading: true, error: '', order: null });

  useEffect(() => {
    if (!reference) {
      setState({ loading: false, error: 'The payment reference is missing.', order: null });
      return;
    }
    api.verifyPayment(reference)
      .then(({ order }) => {
        clearCart();
        setOrders((orders) => [order, ...orders.filter((existing) => existing.id !== order.id)]);
        setState({ loading: false, error: '', order });
      })
      .catch((error) => setState({ loading: false, error: error.message, order: null }));
  }, [reference]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-12 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        {state.loading ? (
          <>
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-[#395082]" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">Verifying your payment</h1>
            <p className="mt-2 text-sm text-slate-500">We are confirming the transaction directly with Paystack.</p>
          </>
        ) : state.order ? (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">Payment verified</h1>
            <p className="mt-2 text-sm text-slate-500">Order {state.order.id} is paid and ready for fulfillment.</p>
          </>
        ) : (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h1 className="mt-5 text-xl font-extrabold text-slate-900">Payment not verified</h1>
            <p role="alert" className="mt-2 text-sm text-red-700">{state.error}</p>
            <p className="mt-2 text-xs text-slate-500">No order will be marked paid unless Paystack confirms it.</p>
          </>
        )}
        {!state.loading && (
          <button onClick={() => onNavigate('/')} className="mt-7 rounded-xl bg-[#395082] px-6 py-3 text-sm font-bold text-white">
            Return to marketplace
          </button>
        )}
      </section>
    </main>
  );
};
