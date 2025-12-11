"use client";
import React, { useState, useEffect } from "react";
import OrderCard from "@/components/OrderCard";
import OrderDetailsModal from "@/components/OrderDetails";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, take: 5, total: 0 });
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async (page = 1, status = "") => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("sellerId");

    try {
      const url = `http://localhost:5000/seller/orders?sellerId=${sellerId}&page=${page}${status ? `&status=${status}` : ""}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(Array.isArray(data.data) ? data.data : []);
      setMeta(data.meta || { page: 1, take: 5, total: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders(meta.page, statusFilter);
  }, [meta.page, statusFilter]);

  const viewOrder = async (id) => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("sellerId");

    try {
      const res = await fetch(`http://localhost:5000/seller/orders/${id}?sellerId=${sellerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = await res.json();
      setSelected(order);
    } catch (err) {
      console.error(err);
    }
  };

  const onStatusChange = async (id, status) => {
    const token = localStorage.getItem("token");
    const sellerId = localStorage.getItem("sellerId");

    console.log("PUT /seller/orders/:id/status", { id, status });

    try {
      const res = await fetch(`http://localhost:5000/seller/orders/${id}/status?sellerId=${sellerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: String(status).toUpperCase() }) 
      });

      const data = await res.json();
      console.log("Response from server:", data);

      // Refresh order list
      fetchOrders(meta.page, statusFilter);

      // Update modal immediately
      setSelected(prev => ({ ...prev, status }));
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const nextPage = () => meta.page * meta.take < meta.total && setMeta({ ...meta, page: meta.page + 1 });
  const prevPage = () => meta.page > 1 && setMeta({ ...meta, page: meta.page - 1 });

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">Orders</h1>

      <ul className="nav nav-pills mb-4 gap-2">
        {["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
          <li className="nav-item" key={s}>
            <button
              className={`nav-link ${statusFilter === s ? "active" : ""} rounded-pill px-3`}
              onClick={() => setStatusFilter(s)}
            >
              {s || "All"}
            </button>
          </li>
        ))}
      </ul>

      <div>
        {orders.length === 0 ? (
          <div className="alert alert-secondary text-center rounded-4">No orders found</div>
        ) : (
          orders.map(o => <OrderCard key={o.id} order={o} onView={viewOrder} />)
        )}
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-outline-secondary rounded-pill px-4" disabled={meta.page === 1} onClick={prevPage}>
          ◀ Previous
        </button>
        <span className="fw-bold">Page {meta.page} of {Math.ceil(meta.total / meta.take)}</span>
        <button className="btn btn-outline-secondary rounded-pill px-4" disabled={meta.page * meta.take >= meta.total} onClick={nextPage}>
          Next ▶
        </button>
      </div>

      {selected && (
        <OrderDetailsModal order={selected} onClose={() => setSelected(null)} onStatusChange={onStatusChange} />
      )}
    </div>
  );
}
