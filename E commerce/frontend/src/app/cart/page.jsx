"use client";
import React, { useState, useEffect } from "react";
import { Button, Table, Form } from "react-bootstrap";
import { Trash2, Plus, Minus } from "lucide-react";
import CheckoutModal from "@/modals/Checkoutmodal";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

 const fetchCart = async () => {
  try {
    setLoading(true);
    const guestId = localStorage.getItem("guestId");
    const userId = localStorage.getItem("userId");
    const id = userId || guestId;
    if (!id) return;

    const res = await fetch(`http://localhost:5000/cart/${id}`);
    const data = await res.json();

    console.log(" Cart data received:", data); 
    if (Array.isArray(data)) {
      setCartItems(data);

     
      const allIds = data.map((i) => i.productId);
      setSelected(allIds);

      calculateTotal(data, allIds);
    } else {
      console.warn(" Unexpected cart response:", data);
      setCartItems([]);
    }

    setLoading(false);
  } catch (err) {
    console.error("Error fetching cart:", err);
    setLoading(false);
  }
};

  const calculateTotal = (items, selectedIds = selected) => {
    const selectedItems = items.filter((i) =>
      selectedIds.includes(i.productId)
    );
    const sum = selectedItems.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotal(sum);
  };

  const toggleSelect = (productId) => {
    setSelected((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      calculateTotal(cartItems, updated);
      return updated;
    });
  };

  const selectAll = () => {
    if (selected.length === cartItems.length) {
      setSelected([]);
      setTotal(0);
    } else {
      const all = cartItems.map((i) => i.productId);
      setSelected(all);
      calculateTotal(cartItems, all);
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) return removeFromCart(productId);

    const guestId = localStorage.getItem("guestId");
    const userId = localStorage.getItem("userId");
    const body = userId
      ? { userId: Number(userId), productId, quantity: newQty }
      : { guestId, productId, quantity: newQty };

    await fetch("http://localhost:5000/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const updated = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    calculateTotal(updated);
  };

  const removeFromCart = async (productId) => {
    const guestId = localStorage.getItem("guestId");
    const userId = localStorage.getItem("userId");
    const body = userId
      ? { userId: Number(userId), productId }
      : { guestId, productId };

    await fetch("http://localhost:5000/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const updated = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updated);
    setSelected((prev) => prev.filter((id) => id !== productId));
    calculateTotal(updated);
  };

  const clearCart = async () => {
    const guestId = localStorage.getItem("guestId");
    const userId = localStorage.getItem("userId");
    const id = userId || guestId;

    if (!id) return;
    await fetch(`http://localhost:5000/cart/clear/${id}`, { method: "DELETE" });
    setCartItems([]);
    setSelected([]);
    setTotal(0);
  };

  // ✅ Checkout (selected only)
  const checkout = () => {
    if (selected.length === 0)
      return alert("⚠️ Please select at least one item to checkout!");
    const selectedItems = cartItems.filter((i) =>
      selected.includes(i.productId)
    );
    const message = selectedItems
      .map((i) => `${i.product.name} (${i.quantity})`)
      .join(", ");
    alert(`🛍️ Checkout for: ${message}`);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">🛒 Your Shopping Cart</h2>

      {loading ? (
        <p className="text-center text-muted">Loading your cart...</p>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="/empty-cart.png"
            alt="Empty Cart"
            style={{ width: "160px", opacity: 0.8 }}
          />
          <h5 className="mt-3 text-muted">Your cart is empty.</h5>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped hover bordered className="align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={selected.length === cartItems.length}
                      onChange={selectAll}
                    />
                  </th>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selected.includes(item.productId)}
                        onChange={() => toggleSelect(item.productId)}
                      />
                    </td>
                    <td>
                      <img
                        src={item.product.imageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "10px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <strong>{item.product.name}</strong>
                    </td>
                    <td>${item.product.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="fw-semibold">{item.quantity}</span>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                    </td>
                    <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 size={16} className="me-1" />
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 p-3 rounded shadow-sm bg-light">
            <Button variant="outline-danger" onClick={clearCart}>
              🧹 Clear Cart
            </Button>

            <h4 className="fw-bold my-3 my-md-0">
              Selected Total:{" "}
              <span className="text-success">${total.toFixed(2)}</span>
            </h4>

            <Button
              variant="success"
              onClick={checkout}
              disabled={selected.length === 0}
            >
              Proceed to Checkout ({selected.length})
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
