"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BsHouseDoor, BsBox, BsCart, BsCurrencyDollar, BsPower } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function SellerDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/seller");
        return;
      }

      const res = await fetch("http://localhost:5000/store/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const storeData = await res.json();
        setStore(storeData);
      }
    } catch (error) {
      console.error("Error fetching store:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="sidebar bg-white border-end shadow-sm p-3" style={{ width: "240px" }}>
        <div className="mb-4 text-center">
          <h5 className="fw-bold text-primary">Seller Panel</h5>
          {loading ? (
            <p className="text-muted small">Loading...</p>
          ) : store ? (
            <div className="mt-2">
              <img
                src={store.logo || "/default-store.png"}
                alt="Store Logo"
                className="img-fluid rounded-circle border"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <p className="mt-2 fw-semibold">{store.name}</p>
            </div>
          ) : (
            <p className="text-muted small">Create a store to get started</p>
          )}
        </div>

        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link
              href="/seller/dashboard"
              className={`nav-link d-flex align-items-center gap-2 fw-semibold ${
                isActive("/seller/dashboard") ? "text-primary" : "text-dark"
              }`}
            >
              <BsHouseDoor /> Dashboard
            </Link>
          </li>
          {store && (
            <>
              <li className="nav-item mb-2">
                <Link
                  href="/seller/orders"
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold ${
                    isActive("/seller/orders") ? "text-primary" : "text-dark"
                  }`}
                >
                  <BsCart /> Orders
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  href="/seller/products"
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold ${
                    isActive("/seller/products") ? "text-primary" : "text-dark"
                  }`}
                >
                  <BsBox /> Products
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  href="/seller/store"
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold ${
                    isActive("/seller/store") ? "text-primary" : "text-dark"
                  }`}
                >
                  <BsCurrencyDollar /> My Store
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className="btn btn-outline-danger mt-4 w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
        >
          <BsPower /> Logout
        </button>
      </div>

      {/* Main content */}
      <div className="content flex-grow-1 p-4">{children}</div>
    </div>
  );
}