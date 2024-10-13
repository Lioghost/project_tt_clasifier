import jwt from 'jsonwebtoken'

//Ayuda a generar un JSONwebToken
const generarJWT = datos => jwt.sign({ id: datos.id, nombre: datos.name, role: datos.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

const generarID = () => Math.random().toString(32).substring(2) + Date.now().toString(32);

export {
    generarJWT,
    generarID
}