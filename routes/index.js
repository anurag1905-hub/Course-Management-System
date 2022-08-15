const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');
const userController = require('../controllers/usersController');

router.get('/',homeController.landingPage);
router.use('/student',require('./student'));
router.use('/faculty',require('./faculty'));

module.exports = router;