import React, { useEffect, useState } from 'react';
import OrderCard from '../../components/OrderCard';
import OrderDetailsModal from '../../components/OrderDetailsModal';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({page:1, take:20, total:0});
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const res = await fetch('/seller/orders'); 
    const json = await res.json();
    setOrders(json.data || json); 
    if (json.meta) setMeta(json.meta);
  }

  async function viewOrder(id) {
    const res = await fetch(`/seller/orders/${id}`);
    const order = await res.json();
    setSelected(order);
  }

  async function onStatusChange(id, status) {
    await fetch(`/seller/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setSelected(null);
    fetchOrders();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 && <div>No orders yet</div>}
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} onView={viewOrder} />
        ))}
      </div>

      {selected && (
        <OrderDetailsModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
}
