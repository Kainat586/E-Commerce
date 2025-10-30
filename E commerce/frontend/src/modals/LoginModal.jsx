"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { saveToken } from "@/utils/authService";
import CheckoutModal from "./Checkoutmodal";

export default function LoginModal({ show, onHide }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup
      ? "http://localhost:5000/signup"
      : "http://localhost:5000/login";

    const body = isSignup
      ? { name, email, password }
      : { email, password };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.token) {
      saveToken(data.token);
      alert(isSignup ? "✅ Signup successful!" : "✅ Logged in!");
      onHide();
      setShowCheckout(true);

    } else {
      alert("❌ " + (data.message || "Something went wrong"));
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{isSignup ? "Sign Up" : "Login"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {isSignup && (
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </small>
        </div>
      </Modal.Body>
      <CheckoutModal
        show={showCheckout}
        onClose={() => setShowCheckout(false)}
       
      />
    </Modal>
   
  );
}
