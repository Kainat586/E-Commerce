"use client";
import React, { useState, useEffect } from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailModal from "@/modals/ProductDetailModal";
import LoginModal from "@/modals/LoginModal";

import axios from "axios";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // 🔹 Add to cart with login check
const handleAddToCart = async (product) => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  console.log("Stored token:", token);
  console.log("Stored userId:", userId);

  // 🧩 If user not logged in
  if (!token || !userId) {
    console.warn("No user/token — showing login modal");
    setShowLoginModal(true);
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/cart/add",
      {
        productId: product.id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(`${product.name} added to cart!`);
  } catch (err) {
    console.error("Add to cart failed:", err);

    // 🧠 Handle expired/invalid session
    if (err.response?.status === 401) {
      alert("⚠️ Session expired! Please log in again.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setShowLoginModal(true);
    } else {
      alert("❌ Failed to add product to cart. Try again later.");
    }
  }
};


  // 🔹 Show product details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">Shop Products</h2>
      <ProductGrid
        products={products}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewDetails}
      />

      {/* 🔹 Product Details Modal */}
      <ProductDetailModal
        show={showDetailModal}
        product={selectedProduct}
        onHide={() => setShowDetailModal(false)}
      />

      {/* 🔹 Login & Signup Modals */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitch={() => {
          setShowLoginModal(false);
        }}
      />

      
    </div>
  );
}
