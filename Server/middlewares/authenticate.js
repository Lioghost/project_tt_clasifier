import jwt from 'jsonwebtoken'

const authenticate = async (req, res, next) => {
    
    // Primero verifica si el encabezado Authorization está presente
    console.log(req.body)
    const authHeader = req.header('Authorization');
    const token = req.cookies._token || (authHeader && authHeader.replace('Bearer ', ''));

    if (!token)
        return res.status(401).json({ msg: 'Acceso denegado, no autenticado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}

export default authenticate
