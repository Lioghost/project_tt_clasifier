import jwt from 'jsonwebtoken'

const authenticate = async (req, res, next) => {
    
    const token = req.cookies._token || req.header('Authorization').replace('Bearer ', '');

    if (!token)
        return res.status(401).json({ msg: 'Acceso denegado, no autenticado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' });
    }
}

export default authenticate
