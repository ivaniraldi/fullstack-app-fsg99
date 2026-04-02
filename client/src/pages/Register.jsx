import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, Form, Button, Container, Row, Col, Alert, FloatingLabel, Stack } from "react-bootstrap";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await register(email, password);
    if (result.success) {
      alert("Usuario registrado con éxito!");
      navigate("/");
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center pt-5 pb-5 animate-fade-in">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={6} xl={5}>
          <Card className="auth-card border-0 shadow-lg overflow-hidden">
            <div className="bg-deep-purple p-4 text-center">
              <h2 className="text-white fw-bold mb-1">REGISTRO</h2>
              <p className="text-white-50 small mb-0">Crea una cuenta para comenzar a administrar productos</p>
            </div>
            <Card.Body className="p-4 p-lg-5">
              {error && <Alert variant="danger" className="border-0 shadow-sm small py-2 bg-danger text-white">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <FloatingLabel controlId="registerEmail" label="Email" className="mb-3 text-secondary">
                  <Form.Control 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="rounded-3 border-0 bg-lighter-dark"
                  />
                </FloatingLabel>
                
                <FloatingLabel controlId="registerPassword" label="Contraseña" className="mb-3 text-secondary">
                  <Form.Control 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="rounded-3 border-0 bg-lighter-dark"
                  />
                </FloatingLabel>

                <FloatingLabel controlId="registerConfirmPassword" label="Confirmar Contraseña" className="mb-4 text-secondary">
                  <Form.Control 
                    type="password" 
                    placeholder="Confirmar Contraseña" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    className="rounded-3 border-0 bg-lighter-dark"
                  />
                </FloatingLabel>

                <Button variant="accent" type="submit" className="w-100 py-3 fw-bold text-white mb-3 shadow-sm rounded-pill transition" disabled={loading}>
                  {loading ? "Registrando..." : "Crear mi Cuenta"}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-secondary small">
                    ¿Ya tienes una cuenta? <Link to="/login" className="text-accent fw-bold text-decoration-none transition">Inicia Sesión</Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
