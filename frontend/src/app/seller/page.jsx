"use client";
import { useEffect, useState } from "react";
import LoginModal from "@/modals/LoginModal";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "SELLER") {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    verifyToken(token, role);
  }, []);

  const verifyToken = async (token, role) => {
    try {
      const res = await fetch("http://localhost:5000/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200 && role === "SELLER") {
        setIsAuthenticated(true);
        router.push("/seller/dashboard"); // Redirect after auth
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return (
      <LoginModal
        show={true}
        onHide={() => {}}
        onLoginSuccess={() => window.location.reload()}
      />
    );
  }

  return null; // Or a loading placeholder, since redirect happens
}
