import React, { useState, useEffect } from "react";

// Toast component
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#28a745",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
};

export default function OrderDetailsModal({ order, onClose, onStatusChange }) {
  const [status, setStatus] = useState(order?.status || "PENDING");
  const [toast, setToast] = useState(false);

  const statusColor = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "danger",
  };

  // Sync local state when order changes
  useEffect(() => {
    setStatus(order?.status || "PENDING");
  }, [order]);

  const save = async () => {
    // Ensure status is valid and a string
    const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      console.error("Invalid status:", status);
      return;
    }

    if (status !== order.status) {
      console.log("Sending status update:", status);
      try {
        await onStatusChange(order.id, status); // backend call
        setToast(true);

        setTimeout(() => {
          setToast(false);
          onClose();
        }, 1200);
      } catch (err) {
        console.error("Error updating status:", err);
      }
    } else {
      onClose();
    }
  };

  return (
    <>
      {toast && <Toast message="Order status updated!" onClose={() => setToast(false)} />}

      <div
        className="modal fade show d-block"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)" }}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-5 shadow-lg border-0 overflow-hidden">
            
            {/* Header */}
            <div className="modal-header border-bottom p-4 bg-light">
              <h4 className="fw-bold text-primary">Order #{order.id}</h4>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              <div className="row g-4">
                
                {/* Left: Product Info */}
                <div className="col-md-6 text-center">
                  <img
                    src={order.product?.imageUrl}
                    alt={order.product?.name}
                    className="img-fluid rounded-4 border shadow-sm mb-3"
                    style={{ objectFit: "cover", width: "100%", maxWidth: "280px", height: "280px" }}
                  />
                  <h5 className="fw-bold mb-2">{order.product?.name}</h5>
                  <div className="text-muted mb-1"><strong>Price:</strong> ₹{order.product?.price}</div>
                  <div className="text-muted mb-3"><strong>Quantity:</strong> {order.quantity}</div>
                  <span className={`badge bg-${statusColor[status]} px-4 py-2 fs-6 shadow-sm`}>
                    {status}
                  </span>
                </div>

                {/* Right: Customer Info */}
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4 shadow-sm h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h5 className="fw-bold mb-3 text-secondary">Customer Information</h5>
                      <div className="mb-2"><strong>Name:</strong> {order.customerName || order.user?.name}</div>
                      <div className="mb-2"><strong>Email:</strong> {order.customerEmail || order.user?.email}</div>
                      <div className="mb-2"><strong>Phone:</strong> {order.customerPhone}</div>
                      <hr />
                      <h6 className="fw-bold text-secondary mb-2">Shipping Address</h6>
                      <div>{order.address}</div>
                    </div>

                    {/* Status Dropdown */}
                    <div className="mt-4">
                      <label className="form-label fw-bold mb-2">Update Status</label>
                      <select
                        className="form-select rounded-pill px-3 py-2"
                        value={status}
                        onChange={(e) => setStatus(String(e.target.value))}
                      >
                        {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map(s => (
                          <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer border-top p-4 bg-light d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold" onClick={onClose}>
                Close
              </button>
              <button className="btn btn-success rounded-pill px-4 py-2 fw-bold" onClick={save}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
