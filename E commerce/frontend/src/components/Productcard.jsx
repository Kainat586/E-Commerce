"use client";
import React from "react";

export default function ProductCard({ product, onViewDetails }) {
  if (!product) return null;

  return (
    <div
      className="card h-100 shadow-sm border-0 hover-shadow transition-all"
      style={{ cursor: "pointer" }}
      onClick={() => onViewDetails(product)}  // ✅ open modal instead of navigating
    >
      <img
        src={product.imageUrl || "/placeholder.png"}
        className="card-img-top"
        alt={product.name}
        style={{ height: "250px", objectFit: "cover", borderRadius: "8px" }}
      />
      <div className="card-body text-center">
        <h5 className="card-title mb-1">{product.name}</h5>
        <p className="text-success fw-bold">
          ${product.price ? product.price.toFixed(2) : "N/A"}
        </p>
      </div>
    </div>
  );
}
