import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useItem } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import ProductForm from "../components/ProductForm";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { items, loading } = useItem();
  const { token } = useAuth();

  return (
    <Container className="py-5 animate-fade-in">
      <Row className="justify-content-center mb-5 mt-4">
        <Col md={10} lg={8}>
          <div className="text-center mb-5">
            <h1 className="display-3 fw-bold mb-3 text-accent">Nuestros Productos</h1>
            <p className="lead text-muted fs-4">
              Descubre una experiencia de compra única con diseño de vanguardia.
            </p>
          </div>
          {token && (
            <div className="mx-auto" style={{ maxWidth: "500px" }}>
              <ProductForm />
            </div>
          )}
        </Col>
      </Row>

      <Row className="g-4">
        {loading ? (
          <Col className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Cargando catálogo...</p>
          </Col>
        ) : items.length > 0 ? (
          items.map((item, index) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard product={item} />
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <div className="p-5 bg-dark border-0 rounded-4 shadow-sm">
              <h3 className="text-secondary">No hay productos disponibles.</h3>
              <p className="text-muted">¡Sé el primero en añadir uno!</p>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Home;
