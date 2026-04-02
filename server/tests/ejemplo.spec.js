const app = require("../index.js");
const request = require("supertest");

const sumar = (a, b) => a + b;
const restar = (a, b) => a - b;

describe("GRUPO DE PRUEBAS 1: OPERACIONES ARITMETICAS", () => {
  it("OPERACION SUMA", () => {
    const n1 = 10;
    const n2 = 3;
    const resultado = sumar(n1, n2);
    expect(resultado).toBe(13);
  });
  it("OPERACION RESTA", () => {
    const n1 = 10;
    const n2 = 3;
    const resultado = restar(n1, n2);
    expect(resultado).toBe(7);
  });
});

describe("GRUPO DE PRUEBAS 2: OPERACIONES CRUD EN ITEMS", () => {
  it("GET /items", async () => {
    const response = await request(app).get("/items").send();
    const status = response.statusCode;
    const body = response.body;
    expect(status).toBe(200);
    expect(body).toBeInstanceOf(Object);
    expect(body.result).toBeInstanceOf(Array);
  });
  it("GET /items BAD URL", async () => {
    const response = await request(app).get("/itemss").send();
    const status = response.statusCode;
    expect(status).toBe(404);
  });
  it("POST /items", async () => {
    const newItem = {
        name: "Test Item on testing enviroment",
        price: 9999
    }
    const response = await request(app).post("/items").send(newItem)
    const status = response.statusCode;
    expect(status).toBe(201);
    expect(response.body.item).toBeInstanceOf(Object);
  })
  it("PUT /items/12", async()=>{
    const newModification = {
        id: 12,
        name: "Test put on testing env",
        price: 9999
    }

    const response = await request(app).put("/items/12").send(newModification)

    expect(response.statusCode).toBe(200)
    expect(response.body.item).toEqual(newModification)

  })
  it("DELETE /items/16", async()=>{
    const response = await request(app).delete("/items/16").set("Authorization", "Bearer " + process.env.TOKEN_TESTING).send()
    const allItems = await request(app).get("/items?limit=999999").send()

    expect(allItems.body.result.find(item => item.id === 16)).toBeUndefined()
  })
});
