"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Form, Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import LoginModal from "@/modals/LoginModal";
import TrackOrderModal from "@/modals/TrackOrderModal";
import { Trash2, Plus, Minus, ShoppingBag, Truck } from "lucide-react";

const customStyles = {
  pageContainer: {
    padding: "3rem 0",
    backgroundColor: "#f8f9fa",
  },
  mainCard: {
    borderRadius: "1rem",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#ffffff",
    padding: "2.5rem",
  },
  itemCard: {
    borderRadius: "0.75rem",
    border: "1px solid #e9ecef",
    transition: "transform 0.2s, box-shadow 0.2s",
    marginBottom: "1.5rem",
    backgroundColor: "#fff",
  },
  summaryCard: {
    borderRadius: "1rem",
    backgroundColor: "#f1f3f5",
    padding: "2rem",
  },
  primaryButton: {
    backgroundColor: "#198754",
    borderColor: "#198754",
    fontWeight: "600",
    padding: "0.75rem 0",
    borderRadius: "0.5rem",
  },
};

const QtyControlButton = ({ icon: Icon, onClick }) => (
  <Button
    variant="light"
    size="sm"
    className="p-1 border-0"
    onClick={onClick}
    style={{ transition: "background-color 0.2s" }}
  >
    <Icon size={16} className="text-secondary" />
  </Button>
);

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return setShowLoginModal(true);

      const res = await fetch(`http://localhost:5000/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCartItems(data);
        const allIds = data.map((i) => i.productId);
        setSelected(allIds);
        calculateTotal(data, allIds);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const calculateTotal = (items, selectedIds = selected) => {
    const sum = items
      .filter((i) => selectedIds.includes(i.productId))
      .reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    setTotal(sum);
  };
  const updateQuantity = async (productId, newQty) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (newQty <= 0) return removeFromCart(productId);

    await fetch("http://localhost:5000/cart/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId, quantity: newQty }),
    });

    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    calculateTotal(updated);
  };
  const removeFromCart = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await fetch("http://localhost:5000/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    });

    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    setSelected((prev) => prev.filter((id) => id !== productId));
    calculateTotal(updated);
  };
  const handleSelect = (productId) => {
    const updated = selected.includes(productId)
      ? selected.filter((id) => id !== productId)
      : [...selected, productId];
    setSelected(updated);
    calculateTotal(cartItems, updated);
  };

  const navigateToCheckout = () => {
    if (selected.length === 0) {
      setShowAlert(true);
      return;
    }
    const query = selected.join(",");
    router.push(`/checkout?selectedIds=${query}`);
  };

  const handleTrackOrder = (orderId) => {
    setTrackOrderId(orderId);
    setShowTrackModal(true);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5" style={customStyles.pageContainer}>
        <Spinner animation="border" variant="primary" />
        <p className="text-muted mt-3 fs-5">Loading your cart...</p>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="text-center py-5" style={customStyles.pageContainer}>
        <ShoppingBag size={80} className="text-muted" style={{ opacity: 0.4 }} />
        <h3 className="mt-4 text-dark fw-bold">Your Cart is Empty</h3>
        <p className="text-secondary mt-2">Find something great to add!</p>
      </div>
    );

  return (
    <div style={customStyles.pageContainer}>
      <Container style={{ maxWidth: "1100px" }}>
        <div style={customStyles.mainCard}>
          <h2 className="fw-bolder mb-5 text-center text-dark">🛒 Your Shopping Bag</h2>

          {showAlert && (
            <Alert
              variant="warning"
              onClose={() => setShowAlert(false)}
              dismissible
              className="mb-4 rounded-3 fw-bold"
            >
              ⚠️ Select items to proceed.
            </Alert>
          )}

          <Row className="g-4 g-lg-5 d-flex align-items-stretch">
            <Col lg={8} className="d-flex flex-column">
              <h4 className="mb-4 fw-bold text-dark">Items ({selected.length} Selected)</h4>
              <div className="flex-grow-1">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center p-3 p-md-4 mb-3 position-relative item-card-hover"
                  >
                    <Form.Check
                      type="checkbox"
                      checked={selected.includes(item.productId)}
                      onChange={() => handleSelect(item.productId)}
                      className="me-3 fs-5 flex-shrink-0"
                      style={{ transform: "scale(1.2)" }}
                    />
                    <img
                      src={item.product.imageUrl || "/placeholder.png"}
                      className="img-fluid rounded-3 shadow-sm me-4 flex-shrink-0"
                      style={{ width: 90, height: 90, objectFit: "cover" }}
                      alt={item.product.name}
                    />
                    <div className="flex-grow-1 me-4">
                      <h5 className="fw-bold mb-1 text-dark">{item.product.name}</h5>
                      <p className="text-muted small mb-2">
                        Unit: <span className="fw-semibold">${item.product.price.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-end text-end ms-auto">
                      <div
                        className="d-flex align-items-center border rounded-pill me-md-4 mb-2 mb-md-0"
                        style={{ padding: "4px" }}
                      >
                        <QtyControlButton
                          icon={Minus}
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        />
                        <span className="mx-2 fw-bold text-dark">{item.quantity}</span>
                        <QtyControlButton
                          icon={Plus}
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        />
                      </div>
                      <div className="d-flex flex-column align-items-end">
                        <p className="fw-bolder fs-5 mb-1 text-primary">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                          variant="link"
                          className="text-danger p-0 d-flex align-items-center small"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 size={14} className="me-1" /> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            <Col lg={4} className="d-flex">
              <div
                style={customStyles.summaryCard}
                className="w-100 h-100 d-flex flex-column"
              >
                <h4 className="fw-bold mb-4 text-dark">Order Summary</h4>
                <hr className="my-3 border-secondary border-opacity-25" />
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary fw-semibold">Subtotal ({selected.length} Items)</span>
                  <span className="fw-bold text-dark">${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary fw-semibold">Shipping Cost</span>
                  <span className="text-success fw-bolder d-flex align-items-center">
                    <Truck size={16} className="me-1" /> FREE
                  </span>
                </div>
                <hr className="my-4 border-secondary border-opacity-25" />
                <div className="mt-auto">
                  <div className="d-flex justify-content-between fw-bolder fs-4 mb-4 text-dark">
                    <span>Total</span>
                    <span className="text-success">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    variant="success"
                    className="w-100"
                    style={customStyles.primaryButton}
                    onClick={navigateToCheckout}
                    disabled={selected.length === 0}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
      />
      <TrackOrderModal
        show={showTrackModal}
        onHide={() => setShowTrackModal(false)}
        orderId={trackOrderId}
      />
    </div>
  );
}
