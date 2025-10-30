"use client";
import React, { useState, useEffect } from "react";
import HeroSection from "@/components/Hero";
import BrandBar from "@/components/BrandBar";
import ProductSection from "@/components/ProductSection";
import BrowseStyleSection from "@/components/BrowseStyleSection";
import CustomerReviewSection from "@/components/CustomerReviews";

export default function Home() {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [products, setProducts] = useState({
    newArrivals: [],
    topSelling: [],
  });

  const fetchBrands = async () => {
  try {
    const res = await fetch("http://localhost:5000/brands");
    const data = await res.json(); 
    const uniqueBrands = [...new Set(data.map((p) => p.name))];

    setBrands(data);
  } catch (err) {
    console.error("Error fetching brands:", err);
  }
};


  const fetchBrandProducts = async (brand) => {
    setSelectedBrand(brand);

    try {
      const [newArrivalsRes, topSellingRes] = await Promise.all([
        fetch(`http://localhost:5000/products/brand/${encodeURIComponent(brand)}/new-arrivals`),
        fetch(`http://localhost:5000/products/brand/${encodeURIComponent(brand)}/top-selling`),
      ]);

      const newArrivals = await newArrivalsRes.json();
      const topSelling = await topSellingRes.json();

      setProducts({ newArrivals, topSelling });
    } catch (err) {
      console.error("Error fetching brand products:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <>
      <HeroSection />

      {/* ✅ BrandBar only once */}
      <div className="container my-5">
        <BrandBar brands={brands} onSelectBrand={fetchBrandProducts} />
      </div>

      {selectedBrand ? (
        <>
          <ProductSection title={`${selectedBrand} - New Arrivals`} products={products.newArrivals} />
          <ProductSection title={`${selectedBrand} - Top Selling`} products={products.topSelling} />
        </>
      ) : (
        <div className="text-center py-5">
          <h3>Select a brand to view its products</h3>
        </div>
      )}

      <BrowseStyleSection />
      <CustomerReviewSection />
    </>
  );
}
