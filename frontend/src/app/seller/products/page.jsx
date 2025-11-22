"use client";
import { useEffect, useState } from "react";
import SellerDashboardLayout from "../layout";
import AddEditProductModal from "@/modals/AddEditModal";
import DeleteProductModal from "@/modals/DeleteProductModal";

export default function SellerProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [store, setStore] = useState(null);

  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      
      const storeRes = await fetch("http://localhost:5000/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storeData = await storeRes.json();
      setStore(storeData);

      if (!storeData?.id) {
        setProducts([]);
        return;
      }

     
      const productsRes = await fetch(`http://localhost:5000/products/store/${storeData.id}`);
      const productsData = await productsRes.json();

      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (err) {
      console.error("Products fetch error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Your Products</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditProduct(null);
            setShowAddEditModal(true);
          }}
        >
          Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <div className="text-center mt-5">
          <img
            src="/empty-products.svg"
            className="img-fluid mb-3"
            style={{ maxWidth: "200px" }}
          />
          <h5 className="fw-bold">No Products Yet</h5>
        </div>
      ) : (
        <div className="row g-4">
          {products.map((p) => (
            <div key={p.id} className="col-md-4">
              <div className="card shadow-sm border-0 rounded-3 h-100 hover-shadow">
                <img
                  src={p.imageUrl || "/default-product.png"}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                />

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5>{p.name}</h5>
                    <p className="text-muted">${p.price}</p>
                    <span className={`badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}>
                      {p.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  <div className="mt-3 d-flex justify-content-between">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => {
                      setEditProduct(p);
                      setShowAddEditModal(true);
                    }}>
                      Edit
                    </button>

                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                      setDeleteProduct(p);
                      setShowDeleteModal(true);
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showAddEditModal && (
        <AddEditProductModal
          show={showAddEditModal}
          product={editProduct}
          storeId={store?.id}
          onHide={() => setShowAddEditModal(false)}
          onSuccess={() => {
            setShowAddEditModal(false);
            fetchProducts();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteProductModal
          show={showDeleteModal}
          product={deleteProduct}
          onHide={() => setShowDeleteModal(false)}
          onSuccess={() => {
            setShowDeleteModal(false);
            fetchProducts();
          }}
        />
      )}

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
          transform: translateY(-3px);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
