"use client";
import { useEffect, useState } from "react";

export default function AllProductsCarousel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/products/all");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading products...</p>;
  if (!products.length) return <p className="text-center mt-5">No products found.</p>;

  return (
    <div className="container my-5">
      <h2 className="fw-bold mb-3">All Products</h2>
      <div className="d-flex overflow-auto gap-3 py-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 shadow-sm rounded overflow-hidden"
            style={{ width: "220px", cursor: "pointer" }}
            onClick={() => window.location.href = `/product/${product.id}`}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-100"
              style={{ height: "180px", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div className="p-2">
              <h6 className="fw-bold m-0">{product.name}</h6>
              <p className="m-0 text-success fw-semibold">Rs {product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
