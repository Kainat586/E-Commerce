"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Badge, Spinner, Row, Col } from "react-bootstrap";
import TrackOrderModal from "../../modals/TrackOrderModal";
import LoginModal from "@/modals/LoginModal";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrackOrder, setSelectedTrackOrder] = useState(null);
  const [trackModalShow, setTrackModalShow] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token || token === "undefined")
      {
        setOrders([]);
        setLoading(false);
        setShowLoginModal(true);
        return;        
      }
      const res = await axios.get("http://localhost:5000/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case "PLACED": return "secondary";
      case "CONFIRMED": return "primary";
      case "SHIPPED": return "info";
      case "OUT_FOR_DELIVERY": return "warning";
      case "DELIVERED": return "success";
      default: return "dark";
    }
  };

  const getStatusBg = (status) => {
    // colorful background for status badge
    switch (status) {
      case "PLACED": return "#6c757d";        // gray
      case "CONFIRMED": return "#0d6efd";     // blue
      case "SHIPPED": return "#0dcaf0";       // cyan
      case "OUT_FOR_DELIVERY": return "#ffc107"; // yellow
      case "DELIVERED": return "#198754";     // green
      default: return "#343a40";              // dark
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-center text-primary">My Orders</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-2 text-muted">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-muted">No orders found.</p>
      ) : (
        <Row xs={1} md={2} lg={2} className="g-4">
          {orders.map((order) => (
            <Col key={order.id}>
              <Card className="shadow-sm rounded-4 border-0 h-100">
                <div className="d-flex flex-column flex-lg-row">
                  {/* Product Image */}
                  {order.product?.imageUrl && (
                    <div className="text-center p-3 bg-light rounded-start-lg">
                      <img
                        src={order.product.imageUrl}
                        alt={order.product?.name}
                        className="img-fluid rounded-4"
                        style={{ width: "160px", height: "160px", objectFit: "cover" }}
                      />
                    </div>
                  )}

                  {/* Order Info */}
                  <Card.Body className="d-flex flex-column justify-content-between p-4">
                    <div>
                      <h5 className="fw-bold">{order.product?.name}</h5>
                      <p className="mb-1">
                        <strong>Total Price:</strong> Rs {order.totalPrice}
                      </p>
                      <p className="mb-1">
                        <strong>Quantity:</strong> {order.quantity}
                      </p>
                      <p className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                      <Badge
                        className="px-3 py-2 fw-semibold mb-3"
                        style={{ backgroundColor: getStatusBg(order.status), color: "white", fontSize: "0.85rem" }}
                      >
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="text-center text-lg-start mt-2">
                      <Button
                        variant="primary"
                        className="fw-semibold px-4 py-2"
                        onClick={() => {
                          setSelectedTrackOrder(order.id);
                          setTrackModalShow(true);
                        }}
                      >
                        Track Order
                      </Button>
                    </div>
                  </Card.Body>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Track Order Modal */}
      {trackModalShow && (
        <TrackOrderModal
          show={trackModalShow}
          handleClose={() => setTrackModalShow(false)}
          orderId={selectedTrackOrder}
        />
      )}
      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          show={showLoginModal}
          handleClose={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
};

export default MyOrdersPage;
