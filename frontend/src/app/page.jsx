"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "@/components/Hero";
import StoreBar from "@/components/StoreBar";
import AllProductsCarousel from "@/components/Horizontal";
import ProductSection from "@/components/ProductSection";
import BrowseStyleSection from "@/components/BrowseStyleSection";
import CustomerReviewSection from "@/components/CustomerReviews";

export default function Home() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [products, setProducts] = useState({ newArrivals: [], topSelling: [] });
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:5000/store/all");
      const data = await res.json();
      setStores(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  // Fetch selected store's products
  const fetchStoreProducts = async (store) => {
    setSelectedStore(store);
    setLoadingProducts(true);

    try {
      const [newArrivalsRes, topSellingRes] = await Promise.all([
        fetch(`http://localhost:5000/store/${store.name}/new-arrivals`),
        fetch(`http://localhost:5000/store/${store.id}/top-selling`),
      ]);

      const newArrivals = await newArrivalsRes.json();
      const topSelling = await topSellingRes.json();

      setProducts({ newArrivals, topSelling });
    } catch (err) {
      console.error("Error fetching store products:", err);
      setProducts({ newArrivals: [], topSelling: [] });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <>
      <HeroSection />

      <div className="container my-5">
        <h4 className="mb-3 fw-bold">Stores</h4>
        <StoreBar
          stores={stores}
          selectedStore={selectedStore}
          onSelectStore={fetchStoreProducts}
        />
      </div>

      {selectedStore && (
        <div className="container mb-5">
          {loadingProducts ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-2">Loading products...</p>
            </div>
          ) : (
            <>
              <ProductSection
                title={`${selectedStore.name} - New Arrivals`}
                products={products.newArrivals.length ? products.newArrivals : []}
              />
              <ProductSection
                title={`${selectedStore.name} - Top Selling`}
                products={products.topSelling.length ? products.topSelling : []}
              />
            </>
          )}
        </div>
      )}

      {!selectedStore && (
        <div className="text-center py-5">
          <h3>Select a store to view its products</h3>
        </div>
      )}

      <BrowseStyleSection />
      <AllProductsCarousel />
      <CustomerReviewSection />
    </>
  );
}
