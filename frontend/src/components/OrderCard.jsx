import React from "react";

export default function OrderCard({ order, onView }) {
  const statusColor = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "danger",
  };

  return (
    <div className="card border-0 shadow-sm mb-3 p-3 rounded-4">
      <div className="row g-3">
        {/* Product Image */}
        <div className="col-3 d-flex align-items-center">
          <img
            src={order.product?.imageUrl}
            alt={order.product?.name}
            className="img-fluid rounded-3 border"
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
          />
        </div>

        {/* Product & Order Details */}
        <div className="col-7">
          <h5 className="fw-bold mb-1">{order.product?.name}</h5>
          <div className="text-muted small mb-1">
            Qty: <strong>{order.quantity}</strong> • ₹{order.totalPrice}
          </div>
          <div className="small text-secondary">
            Ordered on: {new Date(order.createdAt).toLocaleString()}
          </div>
          <span className={`badge bg-${statusColor[order.status]} mt-2`}>
            {order.status}
          </span>
        </div>

        {/* View Button */}
        <div className="col-2 d-flex align-items-center justify-content-end">
          <button
            className="btn btn-outline-primary btn-sm rounded-pill px-3"
            onClick={() => onView(order.id)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
