import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ProductDetailModal({ show, onHide, product }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: "300px", objectFit: "cover" }}
        />
        <p>{product.description}</p>
        <h5>Brand: {product.brand?.name || product.brand}</h5>
        <h4 className="fw-bold mt-3">Rs {product.price}</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
