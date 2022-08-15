const express = require('express');
const router = express.Router();
const passport = require('passport');

const homeController = require('../controllers/homeController');
const userController = require('../controllers/usersController');
const studentController = require('../controllers/studentController');

router.get('/',studentController.home);
router.get('/login',studentController.login);
router.post('/create-session',passport.authenticate(
    'local-login',
    {failureRedirect:'/student/login'}
),studentController.createSession);
router.get('/destroy-session',studentController.destroySession);
router.get('/courses',studentController.courses);
router.get('/courseSelection',studentController.courseSelection);
router.get('/timeTable',studentController.timeTable);
router.get('/settings',studentController.settings);
router.post('/changePassword',studentController.changePassword);
router.get('/courses/viewDetails/',studentController.viewDetails);
router.get('/courses/enroll',studentController.enroll);
router.get('/courses/dropCourse/',studentController.dropCourse);
router.get('/courses/lockChoices',studentController.lockChoices);
router.get('/search',studentController.search);
router.post('/searchResults',studentController.searchDB);

module.exports = router;