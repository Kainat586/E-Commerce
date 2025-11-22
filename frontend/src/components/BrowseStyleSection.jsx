"use client";
import { useEffect, useState } from "react";

export default function DressStyles() {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStyles() {
      try {
        const res = await fetch("http://localhost:5000/styles");
        const data = await res.json();
        setStyles(data);
      } catch (error) {
        console.error("Error fetching styles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStyles();
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading styles...</p>;
  }

  if (styles.length < 4) {
    return <p className="text-center mt-5 text-danger">Not enough styles to display.</p>;
  }

  return (
    <div className="container py-5">
      <div className="bg-light rounded-4 p-4 shadow-sm">
        <h2 className="text-center fw-bold p-6 ">BROWSE BY DRESS STYLE</h2>

        {/* Row 1 - Casual (30%) + Formal (70%) */}
        <div className="row g-3 align-items-stretch mb-3 mt-4">
          <div className="col-12 col-md-4">
            <div className="position-relative overflow-hidden rounded-4 shadow-sm h-100">
              <img
                src={styles[0].image}
                alt={styles[0].name}
                className="w-100 h-40"
                style={{
                  objectFit: "cover",
                  height: "250px",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <h5
                className="position-absolute text-dark fw-semibold"
                style={{
                  top: "15px",
                  left: "20px",
                  backgroundColor: "rgba(255,255,255,0.75)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                }}
              >
                {styles[0].name}
              </h5>
            </div>
          </div>

          <div className="col-12 col-md-8">
            <div className="position-relative overflow-hidden rounded-4 shadow-sm h-100">
              <img
                src={styles[1].image}
                alt={styles[1].name}
                className="w-100 h-40"
                style={{
                  objectFit: "cover",
                  height: "250px",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <h5
                className="position-absolute text-dark fw-semibold"
                style={{
                  top: "15px",
                  left: "20px",
                  backgroundColor: "rgba(255,255,255,0.75)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                }}
              >
                {styles[1].name}
              </h5>
            </div>
          </div>
        </div>

        {/* Row 2 - Party (70%) + Gym (30%) */}
        <div className="row g-3 align-items-stretch">
          <div className="col-12 col-md-8">
            <div className="position-relative overflow-hidden rounded-4 shadow-sm h-100">
              <img
                src={styles[2].image}
                alt={styles[2].name}
                className="w-100 h-40"
                style={{
                  objectFit: "cover",
                  height: "250px",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <h5
                className="position-absolute text-dark fw-semibold"
                style={{
                  top: "15px",
                  left: "20px",
                  backgroundColor: "rgba(255,255,255,0.75)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                }}
              >
                {styles[2].name}
              </h5>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="position-relative overflow-hidden rounded-4 shadow-sm h-100">
              <img
                src={styles[3].image}
                alt={styles[3].name}
                className="w-100 h-40"
                style={{
                  objectFit: "cover",
                  height: "250px",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
              <h5
                className="position-absolute text-dark fw-semibold"
                style={{
                  top: "15px",
                  left: "20px",
                  backgroundColor: "rgba(255,255,255,0.75)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                }}
              >
                {styles[3].name}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
