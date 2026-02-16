const express = require("express");
const AuthControllers = require('../controllers/AuthControllers');



const router = express.Router();

router.route('/register').post(AuthControllers.register);

router.route('/login').post( AuthControllers.login);

router.route('/token_refresh').get( AuthControllers.refresh);

router.route('/logout').post( AuthControllers.logout);


module.exports = router;