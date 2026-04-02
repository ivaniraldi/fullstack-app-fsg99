const express = require("express");
const fs = require("fs");
const cors = require("cors");
const pool = require("./database/db");
const jwt = require("jsonwebtoken")
const { getItems, getFilteredItems, register, verificarCredenciales } = require("./consultas");
require('dotenv').config()
const bcrypt = require("bcryptjs");

const { authMiddleware, verificarAdmin } = require("./middlewares/auth");



const app = express();

app.use(express.json());
app.use(cors());

const reporte = async (req, res, next) => {
  console.log(
    `${req.method} ${req.url} En la fecha ${new Date().toLocaleString()}`,
  );
  //const log = `${req.method} ${req.url} En la fecha ${new Date().toLocaleString()}\n`;
  //let previusLogs = fs.readFileSync("logs.log", "utf-8");
  //fs.writeFileSync("logs.log", previusLogs + log);
  next();
};
app.use(reporte);

const PORT = 3000;

app.listen(PORT, () => {
  console.log("💻 Servidor encendido y funcionando el puerto " + PORT);
});


app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await register(email, hashedPassword)

    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.status(201).json({
      message: "Usuario creado con éxito!",
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    })

  } catch (error) {
    res.status(500).json({
      code: error.code,
      message: error.message
    })
  }
});

app.post("/login", async(req,res)=>{
  try {
    const { email, password } = req.body
    const user = await verificarCredenciales(email, password)
    console.log("Ese usuario existe")
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({
      message: "Sesión iniciada con éxito!",
      token
    })

  } catch (error) {
    console.log("Error al hacer login: ", error)
    res.status(401).send(error)
  }
})



app.get("/items", async (req, res) => {
  try {
    const items = await getItems(req.query);
    res.json(items);
  } catch (error) {
    console.error("❌ Error en la consulta GET /items: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

app.get("/items/filter", async (req, res) => {
  try {
    const items = await getFilteredItems(req.query);
    res.json(items);
  } catch (error) {
    console.error("❌ Error en la consulta GET /items/filter: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

app.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM item WHERE id = $1", [id]);
  res.json(result.rows);
});

app.post("/items", async (req, res) => {
  try {
    const { name, price } = req.body;
    const values = [name, price];
    const result = await pool.query(
      "INSERT INTO item (name, price) VALUES ($1, $2)",
      values,
    );
    res.status(201).send("Producto añadido con éxito!");
  } catch (error) {
    console.error("❌ Error en la consulta POST /items: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

app.put("/items/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    let consulta = "UPDATE item SET name = $1, price = $2 WHERE id = $3";
    let values = [name, price, id];
    const result = await pool.query(consulta, values);
    res.send("Producto actualizado con éxito!");
  } catch (error) {
    console.error("❌ Error en la consulta PUT /items: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});

app.delete("/items/:id", verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let consulta = "DELETE from item where id = $1";
    let values = [id];
    const result = await pool.query(consulta, values);
    res.json({ message: "Producto eliminado con éxito!" });
  } catch (error) {
    console.error("❌ Error en la consulta DELETE /items: " + error);
    res.status(500).json({
      error: error.code,
      message: error.message,
    });
  }
});
