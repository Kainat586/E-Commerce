import React from "react";
import { Button, Card } from "react-bootstrap";

export default function ProductCard({ product, onAddToCart, onViewDetails }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={product.imageUrl}
        alt={product.name}
        style={{ height: "200px", objectFit: "cover", cursor: "pointer" }}
        onClick={() => onViewDetails(product)}
      />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text className="text-muted mb-2">
          {product.brand?.name || product.brand}
        </Card.Text>
        <Card.Text className="fw-bold mb-3">Rs {product.price}</Card.Text>

        <div className="mt-auto d-flex gap-2">
          <Button
            variant="primary"
            className="w-100"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => onViewDetails(product)}
          >
            View
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
