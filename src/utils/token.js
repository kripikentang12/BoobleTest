const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../utils/secrets');
const { JWT_REFRESH_SECRET_KEY } = require('../utils/secrets');
const { logger } = require('./logger');

const generate = (id) => jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: 3600});
const generateRefresh = (id) => jwt.sign({id}, JWT_REFRESH_SECRET_KEY, {expiresIn: 86400})

const decode = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY)
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {
    generate,
    generateRefresh,
    decode
}