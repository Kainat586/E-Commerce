"use client";
import React from "react";

export default function StoreBar({ stores, selectedStore, onSelectStore }) {
  return (
    <div className="d-flex overflow-auto gap-3 py-2">
      {stores.length === 0 && <p>No stores available</p>}

      {stores.map((store) => (
        <div
          key={store.id}
          onClick={() => onSelectStore(store)}
          className={`flex-shrink-0 text-center p-2 rounded-3 shadow-sm cursor-pointer ${
            selectedStore?.id === store.id ? "border border-primary" : "border border-light"
          }`}
          style={{
            minWidth: "150px",
            transition: "all 0.2s",
            background: selectedStore?.id === store.id ? "#f0f8ff" : "#fff",
          }}
        >
          <img
            src={store.logo || "/placeholder.png"}
            alt={store.name}
            className="img-fluid rounded mb-2"
            style={{ height: "80px", objectFit: "cover" }}
          />
          <p className="mb-0 fw-semibold">{store.name}</p>
        </div>
      ))}
    </div>
  );
}
