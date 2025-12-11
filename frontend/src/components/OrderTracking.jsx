import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const STATUS_ORDER = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderTracking({ orderId }) {
  const [status, setStatus] = useState('PENDING');

  // Poll backend every 10 seconds for live update
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/orders/track/${orderId}`);
        setStatus(res.data.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStatus(); // initial fetch
    const interval = setInterval(fetchStatus, 10000); // every 10s

    return () => clearInterval(interval);
  }, [orderId]);

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="container my-4">
      <h4>Track Your Order</h4>
      <div className="d-flex justify-content-between align-items-center mt-4">
        {STATUS_ORDER.map((s, idx) => (
          <div key={s} className="text-center position-relative flex-fill">
            <div
              className={`rounded-circle mx-auto mb-2 ${
                idx < currentIndex ? 'bg-success text-white' : idx === currentIndex ? 'bg-primary text-white' : 'bg-secondary text-white'
              }`}
              style={{ width: '40px', height: '40px', lineHeight: '40px' }}
            >
              {idx < currentIndex ? '✔' : idx + 1}
            </div>
            <div>{s}</div>
            {idx < STATUS_ORDER.length - 1 && (
              <div
                className={`position-absolute top-50 start-100 translate-middle bg-secondary`}
                style={{ width: '100%', height: '4px', zIndex: 0, left: '50%' }}
              ></div>
            )}
          </div>
        ))}
      </div>
      <p className="mt-3">Current status: <strong>{status}</strong></p>
    </div>
  );
}
