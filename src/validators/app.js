const Joi = require('joi');
const validatorHandler = require('../middlewares/validatorHandler');

const sales = (req, res, next) => {
    const schema = Joi.object().keys({
        tgl: Joi.string()
            .required(),
        produk: Joi.array()
            .required(),
    });
    validatorHandler(req, res, next, schema);
};


module.exports = {
    sales
};