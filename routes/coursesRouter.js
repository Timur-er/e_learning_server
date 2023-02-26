const Router = require('express');
const router = new Router()
const courseController = require('../controllers/courseController');

router.post('/create', courseController.createCourse)
router.post('/edit', courseController.editCourse)
router.get('/getAllCourses/:user_id', courseController.getAllCourses)
router.delete('/remove', courseController.removeCourse)
router.post('/addDescription', courseController.addCourseDescription)
router.get('/getCourseDescriptionByID/:course_id', courseController.getCourseDescriptionByID)
router.get('/getCourseByID/:course_id&:user_id', courseController.getCourseByID)
router.get('/buyCourse/:course_id&:user_id', courseController.buyCourse)
router.get('/getTestForCourse/:course_id', courseController.getTestForCourse)
router.get('/getCourseVideo/:course_id', courseController.getCourseVideo)
router.post('/submitCourse', courseController.submitCourse)
router.get('/downloadCourse/:course_id&:user_id', courseController.downloadCertificate)
router.get('/getFinishedCourses/:user_id', courseController.getFinishedCourses)

module.exports = router;