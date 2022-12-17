const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('../utils/secrets');

module.exports = (req,res,next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token']
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, JWT_SECRET_KEY, function(err, decoded) {
            if (err) {
                res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access'
                });
                // return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
            }
            req.decoded = decoded;
            next();
        });
    } else {
        // if there is no token
        // return an error
        res.status(403).send({
            status: 'error',
            message: 'No token provided'
        });
    }
}