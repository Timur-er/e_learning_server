const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter');
const coursesRouter = require('./coursesRouter');
const certificatesRouter  =require('./certificateRouter');

router.use('/user', userRouter);
router.use('/courses', coursesRouter);
router.use('/certificate', certificatesRouter);


module.exports = router