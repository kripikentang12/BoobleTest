const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const checkEmail = require('../middlewares/checkEmail');
const checkToken = require('../middlewares/tokenChecker');
const { signup: signupValidator, signin: signinValidator } = require('../validators/auth');
const { sales: salesValidator} = require('../validators/app');
const authController = require('../controllers/auth.controller');
const saleController = require('../controllers/sales.controller');


router.route('/auth/signup')
    .post(signupValidator, asyncHandler(checkEmail), asyncHandler(authController.signup));

router.route('/auth/signin')
    .post(signinValidator, asyncHandler(authController.signin));

router.route('/app/sales')
    .post(salesValidator, asyncHandler(checkToken),asyncHandler(saleController.sales));

module.exports = router;