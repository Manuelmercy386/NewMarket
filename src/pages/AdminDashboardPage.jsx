import React, { useEffect, useState } from 'react';
import { ArrowLeft, Package, ShoppingCart, Store, Users } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const metricCards = [
  { key: 'users', label: 'Accounts', Icon: Users },
  { key: 'stores', label: 'Stores', Icon: Store },
  { key: 'products', label: 'Products', Icon: Package },
  { key: 'orders', label: 'Orders', Icon: ShoppingCart },
];

export const AdminDashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.getAdminOverview().then(setOverview).catch((requestError) => setError(requestError.message));
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return (
      <main className="min-h-screen bg-[#F8FAFC] px-4 py-12">
        <section className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-extrabold text-slate-900">Administrator access required</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in with an account assigned the ADMIN role to view platform oversight.</p>
          <button onClick={() => onNavigate(user ? '/' : '/login')} className="mt-6 rounded-xl bg-[#395082] px-5 py-3 text-sm font-bold text-white">
            {user ? 'Return to marketplace' : 'Sign in'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <button onClick={() => onNavigate('/')} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> Marketplace
        </button>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#395082]">Platform oversight</p>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Admin dashboard</h1>
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!overview && !error && <p className="text-sm text-slate-500">Loading platform metrics…</p>}
        {overview && (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map(({ key, label, Icon }) => (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{label}</span>
                    <Icon className="h-5 w-5 text-[#395082]" />
                  </div>
                  <p className="mt-3 text-3xl font-extrabold text-slate-900">{overview.totals[key]}</p>
                </div>
              ))}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="font-extrabold text-slate-900">Recent orders</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-bold">Order</th>
                      <th className="px-5 py-3 font-bold">Buyer</th>
                      <th className="px-5 py-3 font-bold">Total</th>
                      <th className="px-5 py-3 font-bold">Payment</th>
                      <th className="px-5 py-3 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.recentOrders.map((order) => (
                      <tr key={order.id} className="border-t border-slate-100">
                        <td className="px-5 py-3 font-bold text-slate-900">{order.id}</td>
                        <td className="px-5 py-3 text-slate-600">{order.buyerName}<br />{order.buyerEmail}</td>
                        <td className="px-5 py-3 font-bold text-slate-900">₦{Number(order.totalAmount).toLocaleString()}</td>
                        <td className="px-5 py-3 text-slate-600">{order.paymentStatus}</td>
                        <td className="px-5 py-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {overview.recentOrders.length === 0 && (
                      <tr><td colSpan="5" className="px-5 py-8 text-center text-slate-500">No orders yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};
