"use client";
import Image from "next/image";
import { Container, Row, Col, Button } from "react-bootstrap";

export default function HeroSection() {
  return (
     <section className="hero-section bg-white">
      <Container fluid className="px-lg-5 ml-6">
        <Row className="align-items-center justify-content-between">
          <Col lg={6} className="text-center text-lg-start">
            <h1 className="fw-bold display-4 mb-3">
              FIND CLOTHES <br /> THAT MATCHES <br /> YOUR STYLE
            </h1>
            <p className="text-muted mb-4 fs-5">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense of style.
            </p>
            <Button variant="dark" className="rounded-pill px-4 py-2 mb-4">
              Shop Now
            </Button>

            <Row className="text-center text-lg-start mt-5">
              <Col xs={4}>
                <h3 className="fw-bold">200+</h3>
                <p className="text-muted small">International Brands</p>
              </Col>
              <Col xs={4}>
                <h3 className="fw-bold">2,000+</h3>
                <p className="text-muted small">High-Quality Products</p>
              </Col>
              <Col xs={4}>
                <h3 className="fw-bold">30,000+</h3>
                <p className="text-muted small">Happy Customers</p>
              </Col>
            </Row>
          </Col>


          {/* RIGHT IMAGE */}
          <Col
            lg={6}
            className="d-flex justify-content-center  mt-5 mt-lg-0 position-relative"
          >
            <div className="hero-image-wrapper">
              <Image
                src="/heroo.jpg"
                alt="Fashion Banner"
                fill
                className="hero-img"
                priority
              />
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 4rem 0;
        }

        .hero-image-wrapper {
          position: relative;
          width: 100%;
          max-width: 650px; /* Adjust this to control image size */
          height: 700px;
        
          overflow: hidden;
          
        }

        .hero-img {
          object-fit: cover;
          // object-position: center right; /* Image shifted slightly to right */
        }

        h1 {
          line-height: 1.2;
        }

        @media (max-width: 992px) {
          .hero-image-wrapper {
            height: 400px;
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
