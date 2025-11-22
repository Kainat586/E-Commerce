"use client";
import { useEffect, useState } from "react";
import SellerDashboardLayout from "../layout";
import CreateStoreModal from "@/modals/CreateStoreModal";

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, earnings: 0 });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    try {
      const storeRes = await fetch("http://localhost:5000/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storeData = await storeRes.json();
      setStore(storeData);

      if (storeData) {
        const statsRes = await fetch(`http://localhost:5000/seller/stats/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!store) {
    return (
      <SellerDashboardLayout>
        <div className="text-center mt-5">
          <h2 className="fw-bold mb-3">Welcome, Seller!</h2>
          <p>You haven’t created your store yet.</p>
          <button className="btn btn-primary mt-3" onClick={() => setShowCreateModal(true)}>
            Create Your Store
          </button>
          <CreateStoreModal
            show={showCreateModal}
            onHide={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchSellerData(); // refresh
            }}
          />
        </div>
      </SellerDashboardLayout>
    );
  }

  return (
    <div>
      <h2 className="fw-bold mb-4">Welcome back, {store.name}!</h2>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 text-center bg-white">
            <h6 className="text-muted">Total Products</h6>
            <h2 className="fw-bold text-primary">{stats.products}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 text-center bg-white">
            <h6 className="text-muted">Orders Received</h6>
            <h2 className="fw-bold text-success">{stats.orders}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-3 p-3 text-center bg-white">
            <h6 className="text-muted">Total Earnings</h6>
            <h2 className="fw-bold text-warning">${stats.earnings}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
