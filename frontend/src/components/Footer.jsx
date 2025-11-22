import React from "react";
import { Send } from "lucide-react";

const Footer = () => (
  <footer className="bg-dark text-white pt-5">
    {/* Newsletter */}
    <div className="bg-secondary py-5">
      <div className="container text-center">
        <h3 className="fw-bold mb-4">
          Stay up to date about our latest offers
        </h3>
        <div className="d-flex justify-content-center">
          <div className="input-group w-50">
            <input
              type="email"
              className="form-control rounded-start-pill"
              placeholder="Enter your email"
            />
            <button className="btn btn-primary rounded-end-pill">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Footer Links */}
    <div className="container pt-5 pb-4">
      <div className="row g-4">
        <div className="col-md-3">
          <h4 className="fw-bold">SHOP.CO</h4>
          <p className="small text-light opacity-75">
            We offer stylish, high-quality fashion. Discover your perfect look
            today.
          </p>
        </div>

        {["Company", "Shop", "Support"].map((title) => (
          <div key={title} className="col-6 col-md-2">
            <h6 className="fw-semibold">{title}</h6>
            <ul className="list-unstyled small">
              {["About", "Features", "Pricing", "News"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-light text-decoration-none">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-4 border-top border-secondary pt-3">
        <small className="text-muted">
          © 2024 SHOP.CO. All rights reserved.
        </small>
      </div>
    </div>
  </footer>
);

export default Footer;
