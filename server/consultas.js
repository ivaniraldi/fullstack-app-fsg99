const pool = require("./database/db");
const format = require('pg-format');
const bcrypt = require("bcryptjs");


const verificarCredenciales = async (email, password) => {
 const consulta = "SELECT * FROM users WHERE email = $1";
 const values = [email];
 const result = await pool.query(consulta, values);



 if (!result.rowCount) throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" };

 const isMatch = await bcrypt.compare(password, result.rows[0].password);

 if(isMatch){
    return result.rows[0]
 }else{
    throw { code: 401, message: "Contraseña incorrecta" }
 }
}

const getItems = async ({limit = 3, order_by = "id_ASC", page = 0 }) =>{
try {
    const [nombre, orden] = order_by.split("_");

    let offset = Number(page) * Number(limit);
    const formattedQuery = format("SELECT * FROM item ORDER BY %s %s LIMIT %s OFFSET %s", nombre, orden, limit, offset)

    const result = await pool.query(formattedQuery);

    const resultTotal = await pool.query("SELECT * FROM item");

    const hateoas = result.rows.map((item) =>{
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            url: `https://fullstack-app-fsg99-backend.onrender.com/items/${item.id}`
        }
    })
    
    return { 
        count: resultTotal.rowCount, 
        previus_page: page > 0 ? `https://fullstack-app-fsg99-backend.onrender.com/items?limit=${limit}&order_by=${order_by}&page=${Number.parseInt(page) - 1}` : null,
        next_page: Number(offset) + Number(limit) < Number(resultTotal.rowCount) ? `https://fullstack-app-fsg99-backend.onrender.com/items?limit=${limit}&order_by=${order_by}&page=${Number.parseInt(page) + 1}` : null,
        result: hateoas 
    };
  } catch (error) {
    console.error("❌ Error en la consulta GET /items: " + error);
    throw new Error(error.message);
  }
}


const getFilteredItems = async ({max_price, min_price}) =>{
    let filtros = []; 
    if(min_price) filtros.push(`price >= ${min_price}`);
    if(max_price) filtros.push(`price <= ${max_price}`);

    let consulta = "SELECT * FROM item";

    if(filtros.length > 0) {
        consulta += " WHERE " + filtros.join(" AND ");
    }
    console.log(consulta)

    const result = await pool.query(consulta);

    return result.rows;
}


const register = async (email, password) =>{
    try {
        let consulta = "INSERT INTO users (email, password, role) values ($1, $2, $3) RETURNING *"
        let role = email == "admin@test.com" ? "admin" : "user";
        let values = [email, password, role]
        const result = await pool.query(consulta, values)
        return result.rows[0]
    } catch (error) {
        console.error("Error al registrar: ", error)
        return { code: error.code, message: error.message }
    }

}

module.exports = {
    getItems,
    verificarCredenciales,
    getFilteredItems,
    register
}
