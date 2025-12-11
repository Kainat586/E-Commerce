"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function LoginModal({ show, onHide, defaultRole }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isSignup
        ? "http://localhost:5000/signup"
        : "http://localhost:5000/login";

      const body = isSignup
        ? { name, email, password, role: defaultRole?.toUpperCase() || "BUYER" }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.token) {
        if (defaultRole === "SELLER" && data.user.role.toUpperCase() !== "SELLER") {
          alert("❌ Only Sellers can login on Seller Page!");
          return;
        }
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role.toUpperCase());
        localStorage.setItem("sellerId", data.user.id);
        if (data.user?.id) localStorage.setItem("userId", data.user.id);

        alert(isSignup ? "✅ Signup successful!" : "✅ Logged in!");

        // 🔥 Close modal after login/signup
        if (onHide) onHide();

        if (data.user.role.toUpperCase() === "SELLER") {
          window.location.href = "/seller/dashboard";
        }
        return;
      }

      alert("❌ " + (data.message || "Something went wrong"));
    } catch (err) {
      console.error(err);
      alert("❌ Network or server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      className="p-3"
    >
      {/* FIXED HEADER WITH PROPER CLOSE BUTTON */}
      <Modal.Header className="border-0 pb-0 position-relative">
        <Modal.Title className="fw-bold text-primary mx-auto">
          {isSignup ? "Create Account" : "Login to Your Account"}
        </Modal.Title>

        {/* FIXED CROSS BUTTON POSITION */}
        <Button
          type="button"
          variant="close"
          aria-label="Close"
          onClick={onHide}
          className="position-absolute end-0 top-0 m-3"
        />
      </Modal.Header>

      <Modal.Body>
        {/* <div className="d-flex justify-content-center mb-3">
          <div
            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center shadow"
            style={{ width: "60px", height: "60px", fontSize: "1.5rem" }}
          >
            <i className={isSignup ? "bi bi-person-plus" : "bi bi-person-circle"}></i>
          </div>
        </div> */}

        <Form onSubmit={handleSubmit} className="px-2 px-md-4">
          {isSignup && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="rounded-pill shadow-sm"
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="rounded-pill shadow-sm"
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="rounded-pill shadow-sm"
              required
            />
          </Form.Group>

          <Button
            type="submit"
            className="w-100 rounded-pill py-2 fw-bold"
            style={{
              background: "linear-gradient(90deg, #4e73df, #1cc88a)",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : isSignup ? (
              "Sign Up"
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <small
            className="text-primary fw-semibold"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
}
