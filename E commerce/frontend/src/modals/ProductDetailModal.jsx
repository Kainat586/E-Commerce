import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function ProductDetailModal({ show, onHide, product, onAddToCart }) {
  if (!product) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          className="img-fluid mb-3 rounded"
        />
        <p><strong>Price:</strong> ${product.price.toFixed(2)}</p>
        <p><strong>Description:</strong> {product.description || "No description available."}</p>
        {product.brand?.name && <p><strong>Brand:</strong> {product.brand.name}</p>}
        {product.stock !== undefined && (
          <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => onAddToCart(product)}>
           Add to Cart
        </Button>
       
      </Modal.Footer>
    </Modal>
  );
}
