const express = require('express');
const router = express.Router();

const passport = require('passport');
const facultyController = require('../controllers/facultyController');

router.get('/',facultyController.home);
router.get('/login',facultyController.login);
router.get('/settings',facultyController.settings);
router.post('/create-session',passport.authenticate(
    'local-login',
    {failureRedirect:'/student/login'}
),facultyController.createSession);

router.get('/destroy-session',facultyController.destroySession);
router.get('/settings',facultyController.settings);
router.get('/courses',facultyController.courses);
router.get('/courses/editCourse',facultyController.editCourse);
router.post('/courses/editCourse',facultyController.saveCourses);
router.get('/timeTable',facultyController.timeTable);
router.get('/editFaculty',facultyController.editFaculty);
router.get('/courses/available/',facultyController.available);
router.get('/courses/unavailable/',facultyController.unavailable);
router.get('/courses/lockChoices/',facultyController.lockChoices);
router.get('/students/',facultyController.students);
router.get('/assignGrades/',facultyController.assignGrades);
router.post('/assignGrades/',facultyController.enterGrades);

module.exports = router;