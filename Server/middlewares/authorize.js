
const authorize = (roles = []) => {
    // roles puede ser un string o un array de strings
    if (typeof roles === 'string')
        roles = [roles];

    return (req, res, next) => {
        
        if (!req.user || !req.user.roles) {
          return res.status(403).json({ message: 'Access denied: No roles found.' });
        }
    
        const userRoles = req.user.roles;
        const hasAccess = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasAccess) {
          return res.status(403).json({ message: 'Access denied: Insufficient permissions.' });
        }
    
        next(); // El usuario tiene permiso, continúa con la siguiente función de middleware o controlador
    };

};

export default authorize








  