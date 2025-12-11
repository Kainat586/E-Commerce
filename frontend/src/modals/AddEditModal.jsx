"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Image, InputGroup } from "react-bootstrap";

export default function AddEditProductModal({ show, onHide, onSuccess, product, storeId }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(product?.name || "");
    setPrice(product?.price || "");
    setDescription(product?.description || "");
    setImageUrl(product?.imageUrl || "");
    setStock(product?.stock || 0);
    setError("");
  }, [product]);

  const handleSubmit = async () => {
    if (!name || !price || stock < 0 || isNaN(price) || isNaN(stock) || !description) {
      setError("Please fill all required fields correctly.");
      return;
    }

    if (!storeId) {
      setError("Store information is missing. Please reload the page.");
      return;
    }

    setLoading(true);
    try {
      const payload = { name, description, price: Number(price), stock: Number(stock), imageUrl, storeId };
      const url = product ? `http://localhost:5000/products/${product.id}` : `http://localhost:5000/products`;
      const method = product ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");
      console.log("Payload sent:", payload);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Failed to save product. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton style={{ borderBottom: "1px solid #e5e5e5", backgroundColor: "#f8f9fa" }}>
        <Modal.Title className="fw-bold" style={{ color: "#495057", fontSize: "1.25rem" }}>
          {product ? "Edit Product" : "Add New Product"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#ffffff", fontFamily: "Arial, sans-serif", fontSize: "0.95rem" }}>
        {error && <div className="alert alert-danger py-1">{error}</div>}

        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Product Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              style={{ borderRadius: "0.5rem", padding: "0.5rem", fontSize: "0.95rem" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Price ($) <span className="text-danger">*</span></Form.Label>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: "#e9ecef", borderRadius: "0.5rem 0 0 0.5rem" }}>$</InputGroup.Text>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                style={{ borderRadius: "0 0.5rem 0.5rem 0", padding: "0.5rem", fontSize: "0.95rem" }}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Stock <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Available stock"
              style={{ borderRadius: "0.5rem", padding: "0.5rem", fontSize: "0.95rem" }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Image URL</Form.Label>
            <Form.Control
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              style={{ borderRadius: "0.5rem", padding: "0.5rem", fontSize: "0.95rem" }}
            />
            {imageUrl && (
              <div className="text-center mt-2">
                <Image
                  src={imageUrl}
                  rounded
                  style={{
                    maxHeight: "120px",
                    width: "auto",
                    border: "1px solid #dee2e6",
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer style={{ borderTop: "1px solid #e5e5e5", backgroundColor: "#f8f9fa", justifyContent: "center" }}>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            borderRadius: "1rem",
            padding: "0.6rem 1.8rem",
            fontWeight: "600",
            fontSize: "1rem",
            background: "#0d6efd",
            borderColor: "#0d6efd",
            boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
          }}
        >
          {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
