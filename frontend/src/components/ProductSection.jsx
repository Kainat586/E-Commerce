import React from "react";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, products, onAddToCart, onViewDetails }) {
  return (
    <section className="py-5">
      <div className="container text-center">
        <h2 className="fw-bold fs-3 text-uppercase mb-5">{title}</h2>

        <div className="row g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="col-6 col-md-3">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
