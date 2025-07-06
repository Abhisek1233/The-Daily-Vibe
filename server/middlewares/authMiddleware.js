import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) 
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token',
        });
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({
            success: false,
            message: 'Not authorized, Invalid token',
        });
    }
};