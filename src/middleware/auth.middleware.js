
import jwt from 'jsonwebtoken';

async function authenticateUser(req, res, next){

        const token = req.cookies.token
        if (!token){
            return res.status(401).json({
                message: 'Unauthorized no token provided'
            });
        }
    
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (!decodedToken){
                return res.status(401).json({
                    message: 'Unauthorized wrong token '
                });
            }
            req.user=decodedToken;
            next();
        }
        catch (err){
            return res.status(401).json({
                message: 'Unauthorized error verifying token'
            });
        }
}


export {authenticateUser}