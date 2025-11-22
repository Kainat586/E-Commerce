'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Sample static data (later replace with backend API)
    setProducts([
      {
        id: 1,
        name: 'iPhone 15 Pro',
        price: 1299,
        image: 'https://cdn.pixabay.com/photo/2015/12/11/09/09/iphone-1081782_1280.jpg',
      },
      {
        id: 2,
        name: 'MacBook Air M3',
        price: 1599,
        image: 'https://cdn.pixabay.com/photo/2016/03/27/07/08/apple-1282241_1280.jpg',
      },
      {
        id: 3,
        name: 'Sony Headphones',
        price: 249,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/06/15/technology-1869231_1280.jpg',
      },
    ]);
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="fw-bold text-center mb-4">Our Products</h2>
      <div className="row">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
