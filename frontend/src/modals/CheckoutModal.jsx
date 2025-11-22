"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutModal = ({ show, onHide, items }) => {
  if (!items || items.length === 0) return null;

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {items.map((item) => (
          <div key={item.productId} className="d-flex justify-content-between mb-2">
            <span>{item.product.name}</span>
            <span>${item.product.price.toFixed(2)}</span>
          </div>
        ))}

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="dark"
          onClick={() => {
            alert("Order placed successfully!");
            onHide();
          }}
        >
          Confirm Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
