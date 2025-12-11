"use client";
import { useEffect, useState } from "react";
import { Card, Badge, Button, Spinner, Form, Row, Col } from "react-bootstrap";
import { FaBoxOpen, FaShoppingCart, FaDollarSign, FaClock } from "react-icons/fa";

export default function SellerStorePage() {
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
    });

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchStoreData();
    }, []);

    const fetchStoreData = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
           
            const userRes = await fetch("http://localhost:5000/store/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const storeData = await userRes.json();
            setStore(storeData);

            const sellerId = storeData.sellerId;

            const statsRes = await fetch(`http://localhost:5000/seller/stats/${sellerId}`);
            const statsData = await statsRes.json();

            setStats({
                totalProducts: statsData.totalProducts || 0,
                totalOrders: statsData.totalOrders || 0,
                pendingOrders: statsData.pendingOrders || 0,
                totalRevenue: statsData.totalRevenue || 0,
            });
            const productsRes = await fetch(`http://localhost:5000/products/store/${storeData.id}`);
            const productsData = await productsRes.json();
            setProducts(productsData);

        } catch (err) {
            console.error("Error fetching store data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading)
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );

    if (!store)
        return <div className="text-center py-5">Store not found</div>;

    return (
        <div className="container py-4">

            {/* Store Banner */}
            <div className="position-relative rounded-4 overflow-hidden shadow-sm mb-4">
                <div style={{ backgroundColor: "#e3f2fd", height: "180px" }} />
                <div className="position-absolute top-50 start-0 translate-middle-y d-flex align-items-center px-4">
                    <img
                        src={store.logo || "/default-store.png"}
                        alt={store.name}
                        className="rounded-circle border border-3 border-primary"
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                    <div className="ms-3 text-dark">
                        <h2 className="fw-bold mb-1">{store.name}</h2>
                        <p className="mb-0 text-muted">
                            {store.description || "Your professional store description here."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="d-flex gap-2 mb-4 flex-wrap">
                <Button
                    variant="primary"
                    className="fw-bold"
                    onClick={() => (window.location.href = "/seller/products")}
                >
                    Add Product
                </Button>

                <Button
                    variant="outline-primary"
                    className="fw-bold"
                    onClick={() => (window.location.href = "/seller/orders")}
                >
                    View Orders
                </Button>

                <Button
                    variant="outline-success"
                    className="fw-bold"
                >
                    Stats Updated Live
                </Button>
            </div>

            {/* Stats Cards */}
            <Row className="g-3 mb-4">
                <Col md={3}>
                    <Card className="shadow-sm rounded-4 text-center p-3 hover-shadow">
                        <FaBoxOpen size={24} className="mb-2 text-primary" />
                        <h5 className="fw-bold">{stats.totalProducts}</h5>
                        <p className="mb-0 text-muted">Products</p>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm rounded-4 text-center p-3 hover-shadow">
                        <FaShoppingCart size={24} className="mb-2 text-success" />
                        <h5 className="fw-bold">{stats.totalOrders}</h5>
                        <p className="mb-0 text-muted">Orders</p>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm rounded-4 text-center p-3 hover-shadow">
                        <FaClock size={24} className="mb-2 text-warning" />
                        <h5 className="fw-bold">{stats.pendingOrders}</h5>
                        <p className="mb-0 text-muted">Pending Orders</p>
                    </Card>
                </Col>

                <Col md={3}>
                    <Card className="shadow-sm rounded-4 text-center p-3 hover-shadow">
                        <FaDollarSign size={24} className="mb-2 text-danger" />
                        <h5 className="fw-bold">₹{stats.totalRevenue.toLocaleString()}</h5>
                        <p className="mb-0 text-muted">Revenue</p>
                    </Card>
                </Col>
            </Row>

            {/* Search Bar */}
            <Form className="mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Form>

            {/* Products */}
            <h4 className="fw-bold mb-3">Your Products</h4>

            {filteredProducts.length === 0 && (
                <div className="text-center text-muted my-5">
                    <img
                        src="/empty-products.svg"
                        alt="No products"
                        style={{ maxWidth: "150px" }}
                        className="mb-3"
                    />
                    <p>No products found. Start by adding new products!</p>
                </div>
            )}

            <Row className="g-4">
                {filteredProducts.map((p) => (
                    <Col md={3} key={p.id}>
                        <Card className="shadow-sm rounded-4 h-100 hover-shadow">
                            <div style={{ height: "180px", overflow: "hidden" }}>
                                <Card.Img
                                    variant="top"
                                    src={p.imageUrl || "/default-product.png"}
                                    style={{ objectFit: "cover", height: "100%" }}
                                />
                            </div>
                            <Card.Body className="d-flex flex-column justify-content-between">
                                <div>
                                    <Card.Title className="fw-bold">{p.name}</Card.Title>
                                    <Card.Text className="text-muted mb-1">₹{p.price}</Card.Text>
                                    <Badge bg={p.stock > 0 ? "success" : "danger"}>
                                        {p.stock > 0 ? "In Stock" : "Out of Stock"}
                                    </Badge>
                                </div>

                                <div className="d-flex gap-2 mt-3">
                                    <Button
                                        variant="primary"
                                        className="flex-fill"
                                        onClick={() =>
                                            (window.location.href = `/seller/products/edit/${p.id}`)
                                        }
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="outline-danger"
                                        className="flex-fill"
                                        onClick={() => alert("Feature: Delete Product")}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.8rem 1.5rem rgba(0, 0, 0, 0.15);
          transform: translateY(-3px);
          transition: all 0.3s ease;
        }
      `}</style>
        </div>
    );
}
