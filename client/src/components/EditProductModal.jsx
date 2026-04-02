import { useState, useEffect } from "react";
import { Modal, Button, Form, FloatingLabel } from "react-bootstrap";
import { useItem } from "../context/ProductContext";

const EditProductModal = ({ show, handleClose, product }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateProduct } = useItem();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await updateProduct(product.id, name, parseFloat(price));
    setLoading(false);
    if (result.success) {
      handleClose();
    } else {
      alert(result.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-card">
      <Modal.Header closeButton className="border-0 bg-deep-purple">
        <Modal.Title className="text-white fw-bold">Editar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-dark">
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="editName" label="Nombre" className="mb-3">
            <Form.Control 
              type="text" 
              placeholder="Nombre" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </FloatingLabel>

          <FloatingLabel controlId="editPrice" label="Precio USD" className="mb-4">
            <Form.Control 
              type="number" 
              step="0.01" 
              placeholder="Precio" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required
            />
          </FloatingLabel>

          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="flex-grow-1" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="accent" type="submit" className="flex-grow-1 btn-accent" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProductModal;
