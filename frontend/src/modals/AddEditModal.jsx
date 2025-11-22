"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddEditProductModal({ show, onHide, onSuccess, product, storeId }) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [stock, setStock] = useState(product?.stock || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(product?.name || "");
    setPrice(product?.price || "");
    setImageUrl(product?.imageUrl || "");
    setStock(product?.stock || 0);
  }, [product]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload = {
        name,
        price: Number(price),
        stock: Number(stock),
        imageUrl,
        storeId, // ⭐ Required
      };

      const url = product
        ? `http://localhost:5000/products/${product.id}`
        : `http://localhost:5000/products`;

      const method = product ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      onSuccess();
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product ? "Edit Product" : "Add Product"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock</Form.Label>
            <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
