"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import TrackOrderModal from "@/modals/TrackOrderModal";
import { Truck } from "lucide-react";
import { useSearchParams } from "next/navigation";

// react-toastify
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const selectedIds =
    searchParams.get("selectedIds")?.split(",").map(Number) || [];

  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token)
          return toast.warning("Please login first");

        const res = await axios.get("http://localhost:5000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data.filter((i) =>
          selectedIds.includes(i.productId)
        );
        setCartItems(items);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load cart items");
      }
    };

    if (selectedIds.length > 0) fetchCartItems();
  }, [selectedIds]);

  // Calculate total
  useEffect(() => {
    setTotal(
      cartItems.reduce(
        (acc, i) => acc + i.product.price * i.quantity,
        0
      )
    );
  }, [cartItems]);

  
      const handleCheckout = async () => {
  try {
    if (!address) return toast.warning("Please enter delivery address");
    if (!phone) return toast.warning("Please enter contact phone number");
    if (selectedIds.length === 0) return toast.warning("No items selected");

    setLoading(true);

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5000/orders/checkout",
      { address,phone, selectedProductIds: selectedIds },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success(res.data.message || "Order placed successfully!");

    if (res.data.orders?.length) {
      setLatestOrderId(res.data.orders[0].id);
      setShowTracker(true);
    }

  } catch (error) {
    const msg = error.response?.data?.message || "Checkout failed";
    if (msg.includes("Only") && msg.includes("items left")) {
      toast.error(msg);
      setTimeout(() => {
        window.location.href = "/cart";
      }, 1800);

      return;
    }
    toast.error(msg);

  } finally {
    setLoading(false);
  }
};

  return (
    <Container className="py-5">

      <h2 className="mb-4 text-center">Checkout</h2>

      <Row>
        {/* LEFT SIDE */}
        <Col lg={8}>
          <h4>Shipping Details</h4>
          <Form.Group className="mb-4">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your contact phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>
          <h4>Items</h4>
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="d-flex justify-content-between mb-3 p-3 border rounded"
            >
              <div>
                <strong>{item.product.name}</strong>
                <p className="mb-0">Qty: {item.quantity}</p>
              </div>
              <div>
                Rs {(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </Col>

        {/* RIGHT SIDE */}
        <Col lg={4}>
          <div className="p-4 border rounded bg-light">
            <h4>Order Summary</h4>

            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal ({selectedIds.length} items)</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <span>Shipping</span>
              <span className="text-success d-flex align-items-center">
                <Truck size={16} className="me-1" /> FREE
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
              <span>Total</span>
              <span>Rs {total.toFixed(2)}</span>
            </div>

            <Button
              variant="success"
              className="w-100"
              onClick={handleCheckout}
              disabled={loading || cartItems.length === 0}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Confirm Order"
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {/* ORDER TRACKER */}
      {latestOrderId && (
        <TrackOrderModal
          show={showTracker}
          handleClose={() => setShowTracker(false)}
          orderId={latestOrderId}
        />
      )}
    </Container>
  );
}
