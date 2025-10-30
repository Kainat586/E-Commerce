import React from "react";

const BrandBar = ({ brands, onSelectBrand }) => {
  return (
    <div className="bg-dark sticky-top shadow-sm w-100 py-2">
      <div className="container text-center d-flex flex-wrap justify-content-center gap-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="text-center"
            style={{ cursor: "pointer" }}
            onClick={() => onSelectBrand(brand.name)}
          >
            <img
              src={brand.logoUrl}
              alt={brand.name}
              style={{ height: "40px", marginBottom: "5px" }}
            />
            <div className="text-uppercase fw-bold text-white fs-5">{brand.name}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BrandBar;
