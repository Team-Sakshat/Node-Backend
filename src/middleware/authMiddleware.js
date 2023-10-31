import jwt from 'jsonwebtoken';
import user from '../model/user.js';

const authMiddleware = async (req, res, next) => {
    try {
        // Check if Authorization header is present
        if( !req.headers.authorization ) {
            const err = new Error('Authorization header is missing');
            err.status = 401;
            throw err;
        }

        // get token, decrpyt and get userId attach to req object
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // check if user exists in db
        const admin = await user.findById(userId);
        if(!admin) {
            const err = new Error('Admin not found');
            err.status = 404;
            throw err;
        }

        // attach userId to req object
        req.role = admin;
        req.admnId = userId;
        next();
    } catch (error) {
        if(error.name === 'JsonWebTokenError') {
            error.status = 400;
            error.message = 'Invalid token';
        }
        next(error)
    }
}

export { authMiddleware }