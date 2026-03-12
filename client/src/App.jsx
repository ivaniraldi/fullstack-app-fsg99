import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(null);
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)

  const getProducts = async () => {
    console.log(import.meta.env.VITE_BACKEND_URL);
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/items");
    const data = await res.json();
    setItems(data);
  };

  const handleSubmit= async (e)=>{
    e.preventDefault()
    let newItem = {
      name, price
    }

   try {
     await fetch(import.meta.env.VITE_BACKEND_URL + "/items", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem)
    })
    getProducts()
   } catch (error) {
    alert(error.message)
   }

  }

  useEffect(() => {
    getProducts();
  }, []);


  const handleDelete = async(id)=>{
    await fetch(import.meta.env.VITE_BACKEND_URL + "/items/" + id, {
      method: "DELETE"
    } )
    getProducts()
  }

  return (
    <>
      <div>
        {items ? (
          items.map((i) => {
            return <p key={i.id}>{i.name}, ${i.price} <button onClick={()=>handleDelete(i.id)}>eliminar</button> <button>editar</button></p>;
          })
        ) : (
          <p>Cargando productos...</p>
        )}
      </div>

      <div>
        <h2>Nuevo producto:</h2>
        <form action="submit" onSubmit={(e)=>handleSubmit(e)}>
          <input value={name} onChange={(e)=>setName(e.target.value)} type="text" />
          <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number" />
          <button>Enviar</button>
        </form>
      </div>
    </>
  );
}

export default App;
