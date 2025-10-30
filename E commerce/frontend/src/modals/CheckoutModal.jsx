"use client";
import React from "react";
import { Modal, Button } from "react-bootstrap";

const CheckoutModal = ({ show, onClose, items }) => {
  if (!items || items.length === 0) return null;

  const total = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Checkout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {items.map((item) => (
          <div key={item.id} className="d-flex justify-content-between mb-2">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        ))}
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="dark" onClick={() => {
          alert("Order placed successfully!");
          onClose();
        }}>
          Confirm Order
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
