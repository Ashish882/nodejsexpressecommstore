const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next) => {

    const authHeader = req.headers.token;

    if(authHeader){
        const token = authHeader.split(' ')[1];
        jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                return res.status(401).json({
                    message: 'Invalid Token'
                });
            }
            req.user = decoded;

            next();
        });
    }else{
        return res.status(401).json({
            message: 'Auth Token is not provided'
        });
    }


}

const verifyTokenAndAuth = (req,res,next) => {

    verifyToken(req,res,()=> {
    
        if(req.user._id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }
    }


    )};


    const verifyTokenAdmin = (req,res,next) => {

        verifyToken(req,res,()=> {
        
            if(req.user.isAdmin){
                next();
            }
            else{
                return res.status(403).json({
                    message: 'Unauthorized role'
                });
            }
        }
    
    
        )};

module.exports = { verifyToken,verifyTokenAndAuth,verifyTokenAdmin  };