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
  }, [pathname]);

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
      <div
        className="sidebar d-flex flex-column bg-white border-end shadow-sm p-3"
        style={{ width: "250px", position: "relative" }}
      >
        <div className="text-center mb-4">
          <h5 className="fw-bold text-primary mb-3">Seller Panel</h5>

          {loading ? (
            <p className="text-muted small">Loading...</p>
          ) : store ? (
            <>
              <img
                src={store.logo || "/default-store.png"}
                alt="Store Logo"
                className="img-fluid rounded-circle border shadow-sm"
                style={{ width: "85px", height: "85px", objectFit: "cover" }}
              />
              <p className="mt-2 fw-semibold text-dark">{store.name}</p>
            </>
          ) : (
            <p className="text-muted small">Create a store to get started</p>
          )}
        </div>

        {/* Navigation */}
        <ul className="nav flex-column mb-auto">
          <li className="nav-item mb-2">
            <Link
              href="/seller/dashboard"
              className={`nav-link d-flex align-items-center gap-2 fw-semibold sidebar-link ${
                isActive("/seller/dashboard") ? "active-link" : ""
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
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold sidebar-link ${
                    isActive("/seller/orders") ? "active-link" : ""
                  }`}
                >
                  <BsCart /> Orders
                </Link>
              </li>

              <li className="nav-item mb-2">
                <Link
                  href="/seller/products"
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold sidebar-link ${
                    isActive("/seller/products") ? "active-link" : ""
                  }`}
                >
                  <BsBox /> Products
                </Link>
              </li>

              <li className="nav-item mb-2">
                <Link
                  href="/seller/store"
                  className={`nav-link d-flex align-items-center gap-2 fw-semibold sidebar-link ${
                    isActive("/seller/store") ? "active-link" : ""
                  }`}
                >
                  <BsCurrencyDollar /> My Store
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Logout */}
        <button
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 mt-auto shadow-sm logout-btn"
          onClick={handleLogout}
          style={{
            borderRadius: "10px",
            padding: "10px",
          }}
        >
          <BsPower size={18} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="content flex-grow-1 p-4">{children}</div>

      {/* ⭐ STYLE JSX FIX — MUST BE HERE */}
      <style jsx>{`
        .sidebar-link {
          color: #333 !important;
          padding: 10px 12px;
          border-radius: 8px;
          transition: 0.2s ease;
        }

        .sidebar-link:hover {
          background: #f1f1f1;
          color: #0d6efd !important;
        }

        .active-link {
          background: #e7f1ff;
          color: #0d6efd !important;
          border-left: 4px solid #0d6efd;
          padding-left: 16px !important;
        }

        .logout-btn:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
