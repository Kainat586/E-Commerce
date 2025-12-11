import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import axios from "axios";

const TrackOrderModal = ({ show, handleClose, orderId }) => {
  const [order, setOrder] = useState(null);

  const steps = [
    { key: "PENDING", label: "Pending", icon: "bi-bag-check" },
    { key: "CONFIRMED", label: "Confirmed", icon: "bi-patch-check" },
    { key: "SHIPPED", label: "Shipped", icon: "bi-truck" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "bi-geo-alt" },
    { key: "DELIVERED", label: "Delivered", icon: "bi-check2-circle" },
  ];

  useEffect(() => {
    if (!orderId || !show) return;

    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/orders/track/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order status", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, [orderId, show]);

  const getProgress = () => {
    if (!order) return 0;
    const index = steps.findIndex((s) => s.key === order.status);
    return ((index + 1) / steps.length) * 100;
  };

  const progress = getProgress();

  return (
    <Modal show={show} onHide={handleClose} centered size="md">
      {/* Header with centered title and default close button */}
      <Modal.Header className="bg-light border-0 position-relative" closeButton>
        <Modal.Title
          className="fw-bold text-primary position-absolute start-50 translate-middle-x text-center"
        >
          Track Your Order
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!order ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Fetching order status...</p>
          </div>
        ) : (
          <>
            {/* ORDER INFO CARD */}
            <div className="p-3 mb-4 shadow-sm rounded bg-white border">
              <h6 className="fw-bold text-secondary mb-3">Order Details</h6>
              <div className="d-flex flex-wrap gap-2">
                <div><strong>Order ID:</strong> #{order.id}</div>
                <div className="text-capitalize"><strong>Status:</strong> {order.status.replace(/_/g, " ")}</div>
                <div className="text-muted" style={{ fontSize: "0.85rem" }}>
                  Last updated: {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* MODERN HORIZONTAL STEPPER */}
            <div className="d-flex justify-content-between position-relative mb-4">
              <div
                className="position-absolute start-0 w-100"
                style={{ top: "25px", height: "4px", background: "#e9ecef", zIndex: 0 }}
              ></div>

              {steps.map((step, index) => {
                const active = steps.findIndex((s) => s.key === order.status) >= index;
                return (
                  <div key={step.key} className="text-center" style={{ width: "20%", zIndex: 1 }}>
                    <div
                      className={`rounded-circle d-flex justify-content-center align-items-center mx-auto shadow-sm ${
                        active ? "bg-primary text-white" : "bg-white border border-secondary text-secondary"
                      }`}
                      style={{ width: 45, height: 45, fontSize: "1.1rem", transition: "all 0.3s" }}
                    >
                      <i className={step.icon}></i>
                    </div>
                    <div className={`mt-2 fw-semibold ${active ? "text-primary" : "text-muted"}`} style={{ fontSize: "0.8rem" }}>
                      {step.label}
                    </div>
                    {order.timestamps?.[step.key] && (
                      <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>
                        {new Date(order.timestamps[step.key]).toLocaleString()}
                      </small>
                    )}
                  </div>
                );
              })}
            </div>

            {/* DELIVERY SUMMARY CARD */}
            <div className="p-3 shadow-sm rounded bg-white border">
              <h6 className="fw-bold text-secondary mb-2">Delivery Summary</h6>
              <div className="d-flex flex-column gap-1 text-secondary" style={{ fontSize: "0.85rem" }}>
                <div><strong>Product:</strong> {order.product?.name}</div>
                <div><strong>Quantity:</strong> {order.quantity}</div>
                <div><strong>Total Price:</strong> Rs. {order.totalPrice}</div>
                <div><strong>Address:</strong> {order.address}</div>
              </div>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default TrackOrderModal;
