import React, { useState } from 'react';

export default function OrderDetailsModal({ order, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order?.status || 'PENDING');

  async function save() {
    await onStatusChange(order.id, status);
  }

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Order #{order.id}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <img src={order.product?.imageUrl} alt="" className="w-full h-48 object-cover rounded" />
            <h3 className="mt-2 font-semibold">{order.product?.name}</h3>
            <div>Price: ₹{order.product?.price}</div>
            <div>Qty: {order.quantity}</div>
          </div>
          <div>
            <h4 className="font-medium">Customer</h4>
            <div>{order.customerName || order.user?.name}</div>
            <div>{order.customerEmail || order.user?.email}</div>
            <div>{order.customerPhone}</div>
            <div className="mt-4">
              <h4 className="font-medium">Shipping Address</h4>
              <div>{order.address}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <label className="block text-sm">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="border rounded px-2 py-1">
              <option>PENDING</option>
              <option>PROCESSING</option>
              <option>SHIPPED</option>
              <option>DELIVERED</option>
              <option>CANCELLED</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Close</button>
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
