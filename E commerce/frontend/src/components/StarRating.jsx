import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={16}
        className={`me-1 ${
          i <= Math.round(rating)
            ? "text-warning fill-warning"
            : "text-secondary"
        }`}
      />
    );
  }
  return <div className="d-flex align-items-center">{stars}</div>;
};

export default StarRating;
