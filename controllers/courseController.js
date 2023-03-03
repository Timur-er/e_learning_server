const ApiError = require('../error/ApiError')
const uuid = require('uuid')
const path = require('path')
const {
    Courses, Lector, Certificates, DescriptionTitles, DescriptionContent, CourseArea, CourseLevel, Enrollments,
    Questions, Answers, CourseVideo, CourseLabels
} = require('../models/models');
const {createCourseInfo, createCourseDescription, createCourseQuestions} = require('../service/course_service');
const {generateCertificate} = require('../service/certificate-service');
const {logger} = require("sequelize/lib/utils/logger");
const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
})

class CourseController {
    async createCourse(req, res, next) {
        try {

            const {course_info, course_description, questions} = req.body;
            const {image, certificate} = req.files;

            const course_id = await createCourseInfo(course_info, image, certificate)

            const description_created = await createCourseDescription(course_id, course_description)

            const created_questions = await createCourseQuestions(course_id, questions)

            return res.json('Course added successfully!')
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async addCourseDescription(req, res, next) {
        try {
            const {course_id, description} = req.body;

            description.map(async desc => {
                const {descriptionTitle, descriptionItem} = desc;
                const db_titles = await DescriptionTitles.create({
                    title: descriptionTitle,
                    course_id,
                })

                const descriptionArray = descriptionItem.split(";")

                descriptionArray.map(async item => {
                    await DescriptionContent.create({
                        description_title_id: db_titles.id,
                        description: item.descriptionItem,
                    })
                })
            })

            return res.json('description added successful!');
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async getAllCourses(req, res, next) {
        try {
            const {user_id} = req.params;

            let courses = await Courses.findAll();

            for (let course of courses) {
                const objectParams = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: course.image
                }
                const command = new GetObjectCommand(objectParams);
                const url = await getSignedUrl(s3, command, {expiresIn: 3600})
                course.image = url;
            }

            if (user_id !== 'undefined') {
                const paid_courses = await Enrollments.findAll({where: {user_id}})

                courses = courses.map(course => {

                    const is_course_paid = paid_courses.find(paid_course => {
                            return paid_course.dataValues.course_id === course.dataValues.id;
                    })

                    let paid = is_course_paid ? is_course_paid.is_paid : false;

                    return {
                        ...course.dataValues,
                        is_paid: paid,
                    };
                });
            }

            return res.json(courses)
        } catch (e) {
            console.log(e);
        }
    }

    async getCourseDescriptionByID(req, res, next) {
        try {
            const {course_id} = req.params;
            const titles = await DescriptionTitles.findAll({where: {course_id}});
            let final = [];
            for (let title of titles) {
                const descriptions = await DescriptionContent.findAll({where: {description_title_id: title.id}})
                let descArray = [];
                for (let description of descriptions) {
                    descArray.push(description.description)
                }
                final.push({title: title.title, description: descArray})
            }
            return res.json(final)
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async getCourseByID(req, res, next) {
        try {
            const {course_id, user_id} = req.params;

            let is_course_bought = false;
            let user_attempts = 0;
            let is_complete = false;

            if (user_id !== 'undefined') {
                const enrollment =  await Enrollments.findOne({where: {user_id, course_id}})
                is_course_bought = enrollment && enrollment.dataValues.is_paid;
                user_attempts = enrollment && enrollment.dataValues.attempts;
                is_complete = enrollment && enrollment.dataValues.is_complete;
            } else {
                is_course_bought = false;
                user_attempts = 0;
            }

            const course = await Courses.findOne({where: {id: course_id}})
            const lector = await Lector.findOne({where: {id: course.lector_id}})

            const objectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: course.image
            }
            const command = new GetObjectCommand(objectParams);
            const url = await getSignedUrl(s3, command, {expiresIn: 3600})
            course.image = url;

            return res.json({course, lector, is_paid: is_course_bought, user_attempts, is_complete});
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }

    async editCourse(req, res) {

    }

    async removeCourse(req, res) {

    }

    async buyCourse(req, res) {
        const {course_id, user_id} = req.params;

        const course = await Courses.findByPk(course_id);

        const enrollment = await Enrollments.create({
            user_id,
            course_id,
            is_paid: true,
            start_date: '2 feb',
            end_date: '3 feb',
            attempts: course.attempts
        })

        await course.increment('total_enrollments');

        return res.json('Course was bought successfully!')
    }

    async getTestForCourse(req, res) {
        const {course_id} = req.params;
        const questions = await Questions.findAll({
            where: {course_id},
            include: [{
                model: Answers,
                as: 'answers',
            }]
        });

        const response = questions.map((question, question_index) => ({
            id: question_index,
            question: question.question,
            answers: question.answers.map((answer, answer_index) => ({
                id: answer_index,
                answer: answer.answer,
                is_correct: answer.is_correct,
            })),
        }));

        return res.json(response)

    }

    async getCourseVideo(req, res) {
        const {course_id} = req.params;
        const video = await CourseVideo.findOne({where: {course_id}});
        return res.json(video)
    }

    async submitCourse(req, res) {
        let {course_id, user_id, test_result} = req.body;
        course_id = +course_id
        console.log(req.body);
        // let response = 'Empty response...';
        //
        const updated_attempts = await Enrollments.decrement('attempts', {
            by: 1,
            where: {
                course_id,
                user_id,
            },
            returning: true,
        })

        const course = await Courses.findOne({where: course_id});

        if (updated_attempts[0][0][0].attempts < 0) {
            await Enrollments.update({
                is_paid: false,
            }, {
                where: {
                    course_id,
                    user_id
                }
            })
            await Enrollments.destroy({where: {course_id, user_id}})
            return res.json('Sorry, you failed the course, you need to buy it again to submit.')
        } else if (test_result >= course.percentage) {
            const enrollment = await Enrollments.update({
                is_complete: true
            }, {
                where: {
                    course_id,
                    user_id
                },
                returning: true,
                plain: true
            })
            return res.json(enrollment[1])
        } else {
            return res.json('Looks like you failed the test!')
        }
    }

    async downloadCertificate(req, res) {
        const {course_id, user_id} = req.params;
        const certificate = await generateCertificate(course_id, user_id);
        res.send(certificate)
    }

    async getFinishedCourses(req, res) {
        const {user_id} = req.params;

        const enrollments = await Enrollments.findAll({where: {user_id: user_id}});

        let finished_courses_response = [];

        for (let enrollment of enrollments) {
            if (enrollment.is_paid && enrollment.is_complete) {
                const course_data = await Courses.findOne({where: {id: enrollment.course_id}});
                const certificate = await generateCertificate(course_data.id, user_id);
                finished_courses_response.push({...course_data.dataValues, certificate});
            }
        }
        return res.json(finished_courses_response);
    }

    async addCourseLabel (req, res) {
        try {
            const {course_label} = req.body;

            await CourseLabels.findOrCreate({where: {label: course_label}})

            return res.json('Course label added successfully')
        } catch (e) {
            console.log(e);
        }
    }

    async getAllCourseLabels (req, res) {
        const courses = await CourseLabels.findAll();
        res.json(courses)
    }
}

module.exports = new CourseController();