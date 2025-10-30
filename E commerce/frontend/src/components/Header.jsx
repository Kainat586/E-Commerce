"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">SHOP.CO</a>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="/shop">Shop</a></li>
            <li className="nav-item"><a className="nav-link" href="/products">Become a Seller</a></li>
          </ul>

          <form className="d-flex me-3">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={18} className="text-secondary" />
              </span>
              <input
                type="search"
                className="form-control border-start-0"
                placeholder="Search products..."
              />
            </div>
          </form>

          <Link href="/cart" className="text-dark ms-3">
            <ShoppingCart size={22} className="cursor-pointer" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
