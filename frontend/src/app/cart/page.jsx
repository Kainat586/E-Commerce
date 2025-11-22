"use client";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import CheckoutModal from "@/modals/CheckoutModal";
import { Trash2, Plus, Minus } from "lucide-react";
import LoginModal from "@/modals/LoginModal";
export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCheckoutModal, setCheckoutModal] = useState(false);
  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return alert("⚠️ Please log in to view your cart!");
      if (!token) {
        console.warn("No user/token — showing login modal");
        setShowLoginModal(true);
        return;
      }

      const res = await fetch(`http://localhost:5000/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        alert("Session expired! Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setCartItems(data);
        const allIds = data.map((i) => i.productId);
        setSelected(allIds);
        calculateTotal(data, allIds);
      } else {
        setCartItems([]);
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    setSelected((prev) => prev.filter((id) => id !== productId));
    calculateTotal(updated);
  };

  const checkout = () => {
    if (selected.length === 0) return alert("⚠️ Select at least one item!");
    const items = cartItems.filter((i) => selected.includes(i.productId));
    alert(`🛍️ Checkout: ${items.map((i) => i.product.name).join(", ")}`);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <p className="text-muted">Loading your cart...</p>
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="text-center py-5">
        <img
          src="/empty-cart.png"
          alt="Empty Cart"
          style={{ width: 220, opacity: 0.7 }}
        />
        <h5 className="mt-3 text-muted">Your cart is empty</h5>
      </div>
    );

  return (
    <div className="container-fluid py-5 bg-light" style={{ minHeight: "90vh" }}>
      <h2 className="fw-bold mb-5 text-center">🛒 Your Cart</h2>
      <div className="row gx-5">
        {/* LEFT: Cart Items */}
        <div className="col-lg-8 mb-2">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="card mb-3 shadow-lg rounded-3"
            >
              <div className="row g-0 align-items-center">
                <div className="col-md-2 text-center p-2">
                  <img
                    src={item.product.imageUrl || "/placeholder.png"}
                    className="img-fluid rounded"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                    alt={item.product.name}
                  />
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{item.product.name}</h5>
                    <p className="text-muted mb-0">${item.product.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-center justify-content-center">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="mx-3 fw-bold">{item.quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="rounded-circle"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="col-md-2 text-center">
                  <p className="fw-bold mb-0">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="col-md-1 text-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Summary */}
        <div className="col-lg-4">
          <div className="card shadow-lg rounded-3 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Items ({selected.length})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Shipping</span>
              <span className="text-success">Free</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button
              variant="success"
              className="w-100 fw-bold"
              onClick={() => setCheckoutModal(true)}
              disabled={selected.length === 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
      <CheckoutModal
        show={showCheckoutModal}
        onHide={() => setCheckoutModal(false)}
        items={cartItems.filter(i => selected.includes(i.productId))}
      />

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitch={() => {
          setShowLoginModal(false);
        }}
      />

    </div>
  );
}
