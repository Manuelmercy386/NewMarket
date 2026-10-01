import React from 'react';
import { useCart } from '../context/CartContext';
import { Package, Store, Eye, ShieldCheck, CheckCircle } from 'lucide-react';

export const BuyerOrdersPage = ({ onOpenOrderTracker }) => {
  const { orders } = useCart();

  const formatPrice = (val) => `₦${Number(val).toLocaleString()}`;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#395082]" />
            <span>My Campus Orders</span>
          </h1>
          <p className="text-xs text-slate-500">Track all your multi-vendor purchases and escrow sub-order states</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#395082] border border-blue-100">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-sm">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500">Add products from campus stores to place your first escrow-protected order.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-slate-900">{order.id}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-[#1b9e4b] border border-green-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{order.paymentStatus.replace(/_/g, ' ')}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Placed: {new Date(order.createdAt).toLocaleString()} • Deliver to: <strong className="text-slate-800">{order.buyerHostel}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-[#395082]">{formatPrice(order.totalAmount)}</span>
                  <button
                    onClick={() => onOpenOrderTracker(order)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#395082]" />
                    <span>View Status Timeline</span>
                  </button>
                </div>
              </div>

              {/* Sub-Orders List */}
              <div className="space-y-2">
                <p className="text-xs text-slate-500 font-bold">Dispatched Vendor Sub-Orders ({order.items.length} items):</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((subItem) => (
                    <div key={subItem.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
                          <Store className="w-3.5 h-3.5 text-[#395082]" />
                          <span>{subItem.storeName}</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">{subItem.productName} (x{subItem.quantity})</p>
                        <p className="text-[11px] text-slate-500">{formatPrice(subItem.unitPrice * subItem.quantity)}</p>
                      </div>

                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${
                        subItem.status === 'DELIVERED' 
                          ? 'bg-green-100 text-[#1b9e4b]' 
                          : 'bg-blue-100 text-[#395082]'
                      }`}>
                        {subItem.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
