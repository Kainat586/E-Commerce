import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { on } from "events";

export default function ShopFilterBar({ brands, onSelectBrand ,onPriceChange}) {
  const [selectedBrand, setSelectedBrand] = useState("");
 
  const [priceRange, setPriceRange] = useState(5000);

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    onSelectBrand(brand);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    onPriceChange(value);
    setPriceRange(value);
  };

  return (
    <div
      className="bg-white rounded-4 shadow-sm p-4"
      style={{
        position: "sticky",
        top: "100px",
      }}
    >
      <div className="d-flex align-items-center mb-3">
        <SlidersHorizontal className="me-2 text-primary" />
        <h5 className="fw-bold mb-0">Filters</h5>
      </div>

      {/* Brand Filter */}
      <h6 className="fw-semibold mt-3 mb-2 text-uppercase text-muted small">
        Brand
      </h6>
      <ul className="list-unstyled mb-3">
        {brands.map((brand, i) => (
          <li
            key={i}
            onClick={() => handleBrandClick(brand)}
            className={`p-2 rounded fw-semibold ${
              selectedBrand === brand
                ? "bg-primary text-white"
                : "text-dark hover-bg-light"
            }`}
            style={{
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            {brand}
          </li>
        ))}
      </ul>

      <hr />

      {/* Price Filter */}
      <h6 className="fw-semibold mb-2 text-uppercase text-muted small">
        Price Range
      </h6>
      <div className="d-flex align-items-center justify-content-between">
        <span className="small text-muted">$500</span>
        <span className="fw-bold text-primary">${priceRange}</span>
      </div>
      <input
        type="range"
        className="form-range mt-2"
        min="500"
        max="5000"
        step="100"
        value={priceRange}
        onChange={handlePriceChange}
      />

      <button
        onClick={() => {
          setSelectedBrand("");
          setPriceRange(5000);
          onSelectBrand("");
        }}
        className="btn btn-outline-secondary w-100 mt-3 rounded-pill fw-semibold"
      >
        Reset Filters
      </button>
    </div>
  );
}
