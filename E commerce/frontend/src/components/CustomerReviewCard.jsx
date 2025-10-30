import React from "react";
import StarRating from "./StarRating";

const CustomerReviewCard = ({ review }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body">
      <div className="d-flex justify-content-between mb-2">
        <StarRating rating={review.rating} />
        <small className="text-muted">
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
      </div>

      <h6 className="fw-bold">
        {review.user?.name || "Anonymous"} 
      </h6>

      <p className="small text-secondary">{review.comment}</p>
    </div>
  </div>
);

export default CustomerReviewCard;
