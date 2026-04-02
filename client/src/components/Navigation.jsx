import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <span className="text-accent fs-2 me-1">ADL</span> 
          <span className="fs-3">Store</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" className="border-0 shadow-none">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="px-3">Catálogo</Nav.Link>
            {token ? (
              <Button variant="link" className="nav-link px-3 text-danger border-0" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="px-3">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="ms-lg-2">
                  <Button className="btn-accent px-4 py-2">Empieza Ahora</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
