import { Form, Button, Card, FloatingLabel } from "react-bootstrap";
import { useState } from "react";
import { useItem } from "../context/ProductContext";

const ProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const { addProduct } = useItem();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    const result = await addProduct(name, parseFloat(price));
    if (result.success) {
      setName("");
      setPrice("");
    } else {
      alert(result.message);
    }
  };

  return (
    <Card className="auth-card border-0 mb-4 form-card overflow-hidden">
      <Card.Body className="p-4 rounded-4">
        <h4 className="mb-4 fw-bold text-center text-white">Publicar Producto</h4>
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="floatingName" label="Nombre" className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Nombre" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="floatingPrice" label="Precio USD" className="mb-4">
            <Form.Control 
              type="number" 
              step="0.01" 
              placeholder="Precio" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required
            />
          </FloatingLabel>

          <Button variant="accent" type="submit" className="btn-accent w-100 py-3 shadow-lg">
            Añadir al Catálogo
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;
