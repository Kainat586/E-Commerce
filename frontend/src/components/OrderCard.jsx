import React from 'react';

export default function OrderCard({ order, onView }) {
  return (
    <div className="border rounded p-4 flex gap-4">
      <img src={order.product?.imageUrl} alt={order.product?.name} className="w-24 h-24 object-cover rounded" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{order.product?.name}</h3>
            <div className="text-sm text-gray-600">Qty: {order.quantity} • ₹{order.totalPrice}</div>
            <div className="text-sm text-gray-500">Ordered: {new Date(order.createdAt).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm font-medium">{order.status}</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => onView(order.id)}>View</button>
        </div>
      </div>
    </div>
  );
}
