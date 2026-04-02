import { useState } from "react";
import { Card, Button, Badge, Stack } from "react-bootstrap";
import { useItem } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import EditProductModal from "./EditProductModal";

const ProductCard = ({ product }) => {
  const { deleteProduct } = useItem();
  const { token } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = async () => {
    if (confirm(`¿Estás seguro de que quieres eliminar ${product.name}?`)) {
      const result = await deleteProduct(product.id);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  const handleEdit = () => {
    setShowEdit(true);
  };

  return (
    <>
      <Card className="h-100 product-card shadow-sm border-0">
        <Card.Body className="d-flex flex-column p-4">
          <Stack direction="horizontal" className="mb-3 align-items-start">
            <Card.Title className="mb-0 fw-bold fs-4">{product.name}</Card.Title>
            <div className="ms-auto text-end">
              <span className="badge rounded-pill bg-hero px-3 py-2 fs-6 fw-bold text-white shadow-sm">
                ${product.price}
              </span>
            </div>
          </Stack>
          <Card.Text className="text-muted small mt-2">
            SKU: ADL-00{product.id}
          </Card.Text>
          <div className="mt-auto pt-4">
            <Stack direction="horizontal" gap={2}>
              {token ? (
                <>
                  <Button variant="outline-danger" size="sm" onClick={handleDelete} className="flex-grow-1 border-0 fw-600">
                    Borrar
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={handleEdit} className="flex-grow-1 border-0 fw-600">
                    Editar
                  </Button>
                </>
              ) : (
                <div className="w-100 p-2 text-center border-top border-secondary-subtle mt-2">
                  <small className="text-muted opacity-75">Regístrate para editar</small>
                </div>
              )}
            </Stack>
          </div>
        </Card.Body>
      </Card>
      <EditProductModal 
        show={showEdit} 
        handleClose={() => setShowEdit(false)} 
        product={product} 
      />
    </>
  );
};

export default ProductCard;
