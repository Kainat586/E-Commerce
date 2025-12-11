"use client";
import { useEffect, useState } from "react";
import LoginModal from "@/modals/LoginModal";
import { useRouter } from "next/navigation";

export default function SellerPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false); // FIX
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "SELLER") {
      // USER NOT LOGGED IN
      setIsAuthenticated(false);
      setShowModal(true); // SHOW LOGIN MODAL
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
        router.push("/seller/dashboard");
      } else {
        setIsAuthenticated(false);
        setShowModal(true); // SHOW MODAL
      }
    } catch {
      setIsAuthenticated(false);
      setShowModal(true); // SHOW MODAL
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {!isAuthenticated && (
        <LoginModal
          show={showModal}
          onHide={() => setShowModal(false)}
          defaultRole="SELLER"   
        />

      )}
    </>
  );
}
