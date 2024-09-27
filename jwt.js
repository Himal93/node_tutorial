const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) =>{

    // extract the jwt token fron the request headers
    const token = req.headers.authorization.split(' ')(1);
    if(!token) return res.status(401).json({error: 'Unauthorized'});
    
    try{
        // verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // attach user information to the request object aka payload
        req.jwtPayload = decoded;
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({error: 'Invalid token'});
    }
}


// function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET);
}


module.exports = jwtAuthMiddleware;