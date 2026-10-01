import React from 'react';
import { X, CheckCircle, Clock, PackageCheck, Store, ShieldCheck } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'PAID', label: 'Payment Confirmed', icon: ShieldCheck, desc: 'Payment received successfully. Sub-orders dispatched to vendors.' },
  { key: 'PROCESSING', label: 'Preparing Order', icon: Clock, desc: 'Student vendor is preparing your order in hostel/shop.' },
  { key: 'READY_FOR_PICKUP', label: 'Out for Delivery / Pickup', icon: PackageCheck, desc: 'Order is with campus courier or ready at pickup point.' },
  { key: 'DELIVERED', label: 'Delivered & Complete', icon: CheckCircle, desc: 'Delivered to your hostel room. Funds released to vendor.' },
];

export const OrderTimelineModal = ({ order, onClose }) => {
  if (!order) return null;

  const formatPrice = (val) => `₦${Number(val).toLocaleString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-[#1b9e4b] border border-green-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Escrow Protected State Machine</span>
            </span>
            <span className="text-xs text-slate-500 font-mono font-bold">{order.id}</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1.5">Fulfillment Status Tracker</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Campus delivery point: <strong className="text-slate-800">{order.buyerHostel}</strong>
          </p>
        </div>

        {/* Multi-Vendor Sub-Orders Breakdown */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {order.items.map((subItem) => {
            const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === subItem.status);
            const activeStepIndex = currentStepIdx === -1 ? 0 : currentStepIdx;

            return (
              <div key={subItem.id} className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4">
                
                {/* Store & Item Title */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#395082] flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{subItem.storeName}</h4>
                      <p className="text-[11px] text-slate-600 font-medium">{subItem.productName} (x{subItem.quantity})</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900">{formatPrice(subItem.unitPrice * subItem.quantity)}</span>
                    <div className="text-[10px] font-extrabold text-[#395082] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mt-0.5">
                      {subItem.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                {/* Horizontal Stepper Timeline */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= activeStepIndex;
                    const isCurrent = idx === activeStepIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center space-y-1.5">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition duration-200 ${
                          isCompleted
                            ? 'bg-[#1b9e4b] text-white shadow-sm'
                            : 'bg-white text-slate-400 border border-slate-300'
                        }`}>
                          {idx + 1}
                        </div>

                        <span className={`text-[10px] font-bold leading-tight ${isCurrent ? 'text-[#395082]' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-order status description */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600">
                  💡 {STATUS_STEPS[activeStepIndex]?.desc}
                </div>

              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
