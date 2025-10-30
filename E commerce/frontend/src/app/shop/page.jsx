"use client";
import React, { useState, useEffect } from "react";
import ShopFilterBar from "@/components/ShopFilterbar";
import ProductGrid from "@/components/ProductGrid";
import ProductDetailModal from "@/modals/ProductDetailModal";
import LoginModal from "@/modals/Loginmodal";
export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchProducts = async (brand = "") => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/products";
      if (brand)
        url = `http://localhost:5000/products/brand/${encodeURIComponent(brand)}`;
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(
        data.filter((p) => p && typeof p.price === "number" && p.price <= maxPrice)
      );


      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      const uniqueBrands = [
        ...new Set(
          data.map((p) => (typeof p.brand === "object" ? p.brand.name : p.brand))
        ),
      ];
      setBrands(uniqueBrands);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const addToCart = async (product) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // 🧠 Save intended action & redirect
    localStorage.setItem("pendingAction", JSON.stringify({
      type: "addToCart",
      productId: product.id,
      quantity: 1
    }));
    setShowLoginModal(true);
    return;
  }

  const res = await fetch("http://localhost:5000/cart/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: product.id,
      quantity: 1,
    }),
  });

  const data = await res.json();
  if (res.ok) alert(`🛒 ${product.name} added to cart!`);
  else alert(`❌ ${data.message}`);
};

  function generateGuestId() {
    const id = "guest-" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("guestId", id);
    return id;
  }

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  useEffect(() => {
    setFilteredProducts(
      products.filter((p) => p && typeof p.price === "number" && p.price <= maxPrice)
    );


  }, [maxPrice, products]);

  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  return (
    <div className="container-fluid py-5 bg-light">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-12 col-md-3">
          <ShopFilterBar
            brands={brands}
            onSelectBrand={(brand) => {
              setSelectedBrand(brand);
              fetchProducts(brand);
            }}
            onPriceChange={setMaxPrice}
          />
        </div>

        {/* Product Grid */}
        <div className="col-12 col-md-9">
          <h2 className="fw-bold text-uppercase mb-4 text-center">
            {selectedBrand ? `${selectedBrand} Collection` : "All Products"}
          </h2>

          {loading ? (
            <p className="text-center text-muted">Loading products...</p>
          ) : (
            <ProductGrid
              products={filteredProducts}
              onAddToCart={addToCart}
              onViewDetails={handleViewDetails}
            />
          )}
        </div>
      </div>

     
      <ProductDetailModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={selectedProduct}
        onAddToCart={addToCart}
      />
      <LoginModal
        
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
    </div>
  );
}
