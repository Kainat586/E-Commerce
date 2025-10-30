"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomerReviewCard from "./CustomerReviewCard";

const CustomerReviewSection = () => {
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const reviewsPerSlide = 3;

  const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);

  const nextSlide = () => setIndex((i) => (i + 1) % totalSlides);
  const prevSlide = () => setIndex((i) => (i - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/sitereviews");
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const displayedReviews = reviews.slice(
    index * reviewsPerSlide,
    index * reviewsPerSlide + reviewsPerSlide
  );

  return (
    <section className="py-5 bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-5 bg-light rounded-4 shadow-lg p-5">
        {/* Heading + Controls */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-center text-uppercase text-dark mb-3 mb-sm-0 fs-2">
            Our Happy Customers 
          </h2>

          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-dark rounded-circle shadow-sm"
              onClick={prevSlide}
              disabled={totalSlides === 0}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="btn btn-outline-dark rounded-circle shadow-sm"
              onClick={nextSlide}
              disabled={totalSlides === 0}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div className="row g-4 justify-content-center text-center">
          {reviews.length === 0 ? (
            <p className="text-muted fs-5 mt-3">No reviews yet. Be the first to share your experience!</p>
          ) : (
            displayedReviews.map((review, i) => (
              <div key={i} className="col-12 col-md-6 col-lg-4">
                <CustomerReviewCard review={review} />
              </div>
            ))
          )}
        </div>

        {totalSlides > 1 && (
          <div className="d-flex justify-content-center mt-4 gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <span
                key={i}
                onClick={() => setIndex(i)}
                className={`rounded-circle ${index === i ? "bg-dark" : "bg-secondary opacity-50"} `}
                style={{ width: 12, height: 12, cursor: "pointer" }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviewSection;
