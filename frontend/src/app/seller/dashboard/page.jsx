"use client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Spinner, Button } from "react-bootstrap";
import { Line, PolarArea } from "react-chartjs-2";
import CreateStoreModal from "@/modals/CreateStoreModal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function SellerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState(null);
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [ordersGraph, setOrdersGraph] = useState({ labels: [], data: [] });
  const [revenueGraph, setRevenueGraph] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const storeRes = await fetch("http://localhost:5000/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let storeData = null;

      if (storeRes.ok) {
        const text = await storeRes.text();
        storeData = text ? JSON.parse(text) : null;
      }

      setStore(storeData);

      if (storeData) {
        const sellerId = storeData.sellerId;

        const statsRes = await fetch(
          `http://localhost:5000/seller/stats/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const statsData = await statsRes.json();
        setStats(statsData);

        const ordersRes = await fetch(
          `http://localhost:5000/seller/stats/orders/graph/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const ordersData = await ordersRes.json();
        setOrdersGraph(ordersData);

        const revenueRes = await fetch(
          `http://localhost:5000/seller/stats/revenue/graph/${sellerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const revenueData = await revenueRes.json();
        setRevenueGraph(revenueData);
      }
    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );

 
  if (!store)
    return (
      <div className="text-center mt-5">
        <h2 className="fw-bold mb-3">Welcome, Seller!</h2>
        <p>You haven't created your store yet.</p>

        <Button
          variant="primary"
          onClick={() => setShowCreateStoreModal(true)} 
          className="mt-3"
        >
          Create Your Store
        </Button>

        <CreateStoreModal
          show={showCreateStoreModal} 
          onHide={() => setShowCreateStoreModal(false)}
          onSuccess={() => {
            setShowCreateStoreModal(false);
            fetchDashboardData();
          }}
        />
      </div>
    );

  const ordersChartData = {
    labels: ordersGraph.labels,
    datasets: [
      {
        label: "Orders",
        data: ordersGraph.data,
        fill: false,
        borderColor: "#0d6efd",
        backgroundColor: "#0d6efd",
        tension: 0.3,
      },
    ],
  };
  const ordersChartOptions = { responsive: true, plugins: { legend: { position: "top" } } };

  // --- Revenue Polar Chart ---
  const revenuePolarData = {
    labels: revenueGraph.labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueGraph.data,
        backgroundColor: revenueGraph.labels.map(
          (_, i) => `hsl(${(i * 30) % 360}, 70%, 50%)`
        ),
        borderWidth: 1,
      },
    ],
  };
  const revenuePolarOptions = { responsive: true, plugins: { legend: { position: "right" } } };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Welcome back, {store.name}!</h2>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm p-3 rounded-3">
            <h6 className="text-muted">Products</h6>
            <h2 className="fw-bold text-primary">{stats.totalProducts}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3 rounded-3">
            <h6 className="text-muted">Total Orders</h6>
            <h2 className="fw-bold text-success">{stats.totalOrders}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3 rounded-3">
            <h6 className="text-muted">Pending Orders</h6>
            <h2 className="fw-bold text-warning">{stats.pendingOrders}</h2>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm p-3 rounded-3">
            <h6 className="text-muted">Revenue</h6>
            <h2 className="fw-bold text-danger">₹{stats.totalRevenue.toLocaleString()}</h2>
          </Card>
        </Col>
      </Row>

      {/* Charts Side by Side */}
      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm rounded-3 h-100">
            <h5 className="mb-3">Orders Over Time</h5>
            <Line data={ordersChartData} options={ordersChartOptions} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm rounded-3 h-100">
            <h5 className="mb-3">Revenue Distribution</h5>
            <PolarArea data={revenuePolarData} options={revenuePolarOptions} />
          </Card>
        </Col>
      </Row>
      <CreateStoreModal>
        show={showCreateStoreModal}
        onHide={() => setShowCreateStoreModal(false)}
        onSuccess={() => {
          setShowCreateStoreModal(false);
          fetchDashboardData();
        }}

      </CreateStoreModal>
    </div>

  );
}
