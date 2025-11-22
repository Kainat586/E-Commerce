import React from "react";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid({ products, onAddToCart, onViewDetails }) {
  if (!products.length)
    return <p className="text-muted text-center">No products found.</p>;

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
      {products.map((p) => (
        <div className="col d-flex" key={p.id}>
          <ProductCard
            product={p}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
}
