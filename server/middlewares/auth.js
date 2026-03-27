const jwt = require('jsonwebtoken');
require("dotenv").config()

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No se proporcionó un token de autenticación" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.sendStatus(403);
  }
};

const verificarAdmin = async (req, res, next)=>{
    const token = req.headers.authorization?.split(' ')[1]
    console.log(token)

    if(!token) {
      return res.json({ message: "No se proporcionó un token de autenticación" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = jwt.decode(token)

    console.log(user)
    if(decoded.role == 'user' ){
      return res.json({ message: "No tienes permisos para acceder a esta ruta" })
    }else if( decoded.role == 'admin' ){
        next()
    }
}

module.exports = { authMiddleware, verificarAdmin };