"use client";
import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { Truck } from "lucide-react";

const CheckoutModal = ({ show, onHide, items,handleCheckout }) => {
  if (!items || items.length === 0) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = 0; // Free shipping
  const tax = 0; // Estimated tax
  const total = subtotal + shipping + tax;

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold fs-4">🛒 Checkout</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Items */}
        <div className="mb-3">
          {items.map((item) => (
            <Row key={item.productId} className="align-items-center mb-2">
              <Col xs={3}>
                <img
                  src={item.product.imageUrl || "/placeholder.png"}
                  alt={item.product.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                />
              </Col>
              <Col xs={5}>
                <h6 className="mb-0 fw-semibold">{item.product.name}</h6>
                <small className="text-muted">Qty: {item.quantity}</small>
              </Col>
              <Col xs={4} className="text-end fw-bold">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Col>
            </Row>
          ))}
        </div>

        <hr />

        {/* Summary */}
        <div className="mb-3">
          <Row className="mb-1">
            <Col className="text-secondary">Subtotal</Col>
            <Col className="text-end fw-semibold">${subtotal.toFixed(2)}</Col>
          </Row>
          <Row className="mb-1">
            <Col className="text-secondary d-flex align-items-center">
              <Truck size={16} className="me-1" /> Shipping
            </Col>
            <Col className="text-end text-success fw-semibold">{shipping === 0 ? "FREE" : shipping.toFixed(2)}</Col>
          </Row>
          <Row className="mb-2">
            <Col className="text-secondary">Tax (Estimated)</Col>
            <Col className="text-end">${tax.toFixed(2)}</Col>
          </Row>
          <Row className="fw-bold fs-5 border-top pt-2">
            <Col>Total</Col>
            <Col className="text-end text-danger">${total.toFixed(2)}</Col>
          </Row>
        </div>
      </Modal.Body>

      <Modal.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-center">

        <Button
          variant="dark"
          className="fw-bold w-100 w-md-auto"
          onClick={async () => {
            await handleCheckout();   // ⚡ call backend
            onHide();
          }}
        >
          Confirm Order (${total.toFixed(2)})
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutModal;
