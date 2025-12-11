"use client";
import { useEffect, useState } from "react";
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
    fetchStoreAndProducts();
  }, []);

  const fetchStoreAndProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // Fetch store info first
      const storeRes = await fetch("http://localhost:5000/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storeData = await storeRes.json();
      setStore(storeData);

      if (!storeData?.id) {
        setProducts([]);
        return;
      }

      // Fetch products for the store
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

  const handleAddProduct = () => {
    if (!store?.id) return alert("Store not loaded yet. Please wait a moment.");
    setEditProduct(null);
    setShowAddEditModal(true);
  };

  const handleEditProduct = (product) => {
    if (!store?.id) return alert("Store not loaded yet. Please wait a moment.");
    setEditProduct(product);
    setShowAddEditModal(true);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">Your Products</h2>
        <button
          className="btn btn-primary btn-lg rounded-pill"
          onClick={handleAddProduct}
        >
          <i className="bi bi-plus-lg me-2"></i> Add Product
        </button>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center mt-5">
          <img
            src="/empty-products.svg"
            className="img-fluid mb-3"
            style={{ maxWidth: "220px" }}
          />
          <h5 className="fw-bold text-secondary">No Products Yet</h5>
          <p className="text-muted">Click "Add Product" to create your first product.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((p) => (
            <div key={p.id} className="col">
              <div className="card h-100 shadow-sm border-0 rounded-4">
                <div className="position-relative">
                  <img
                    src={p.imageUrl || "/default-product.png"}
                    className="card-img-top rounded-top-4"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <span
                    className={`position-absolute top-0 end-0 m-2 badge ${p.stock > 0 ? "bg-success" : "bg-danger"}`}
                    style={{ fontSize: "0.85rem" }}
                  >
                    {p.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-bold">{p.name}</h5>
                    <p className="text-primary fw-bold fs-5 mb-2">${p.price}</p>
                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                      SKU: {p.id} • {p.category || "General"}
                    </p>
                  </div>

                  <div className="mt-3 d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary btn-sm rounded-pill"
                      onClick={() => handleEditProduct(p)}
                    >
                      <i className="bi bi-pencil-fill me-1"></i> Edit
                    </button>

                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill"
                      onClick={() => {
                        setDeleteProduct(p);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash-fill me-1"></i> Delete
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
            fetchStoreAndProducts();
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
            fetchStoreAndProducts();
          }}
        />
      )}

      <style jsx>{`
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}
