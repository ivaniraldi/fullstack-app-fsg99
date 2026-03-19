const pool = require("./database/db");
const format = require('pg-format');

const getItems = async ({limit = 3, order_by = "id_ASC", page = 0 }) =>{
try {
    const [nombre, orden] = order_by.split("_");

    let offset = Number(page) * Number(limit);
    const formattedQuery = format("SELECT * FROM item ORDER BY %s %s LIMIT %s OFFSET %s", nombre, orden, limit, offset)

    const result = await pool.query(formattedQuery);

    const resultTotal = await pool.query("SELECT * FROM item");

    const hateoas = result.rows.map((item) =>{
        return {
            name: item.name,
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

module.exports = {
    getItems,
    getFilteredItems
}
