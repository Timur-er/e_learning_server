const {Lector, CourseArea, CourseLevel, Certificates, Courses, DescriptionTitles, DescriptionContent, CourseVideo,
    Questions, Answers
} = require("../models/models");
const path = require("path");
const uuid = require('uuid')
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");


class CourseService {

    async createCourseInfo (main_info, image, certificate) {
        const {
            course_title,
            lector,
            lector_description,
            lector_link,
            short_description,
            video_link,
            price,
            previous_price,
            course_duration,
            course_level,
            course_area,
            attempts,
            percentage,
            course_labels,
        } = JSON.parse(main_info)

        let image_file_name = uuid.v4() + '.jpg';
        let certificate_file_name = uuid.v4() + '.jpg';

        console.log(image);

        const s3 = new S3Client({
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: process.env.BUCKET_REGION,
        })

        const image_params = {
            Bucket: process.env.BUCKET_NAME,
            Key: image_file_name,
            Body: image.data,
            ContentType: image.mimetype,
        }
        const image_command = new PutObjectCommand(image_params)

        const certificate_params = {
            Bucket: process.env.BUCKET_NAME,
            Key: certificate_file_name,
            Body: certificate.data,
            ContentType: certificate.mimetype,
        }
        const certificate_command = new PutObjectCommand(certificate_params)

        await s3.send(image_command);
        await s3.send(certificate_command);


        // await image.mv(path.resolve(__dirname, '..', 'static', image_file_name));
        // await certificate.mv(path.resolve(__dirname, '..', 'static', certificate_file_name))

        let [lectorDB, lector_created] = await Lector.findOrCreate({
            where: {lector_name: lector},
            defaults: {
                short_description: lector_description,
                lector_link: lector_link
            }
        })
        let [area, area_created] = await CourseArea.findOrCreate({where: {area: course_area}})
        let [level, level_created] = await CourseLevel.findOrCreate({where: {level: course_level}})

        const course = await Courses.create({
            course_name: course_title,
            price,
            short_description,
            lector,
            image: image_file_name,
            lector_id: lectorDB.id,
            course_duration,
            attempts,
            percentage,
            course_area_id: area.id,
            course_level_id: level.id,
            labels_id: course_labels,
            previous_price: previous_price,
        })

        const course_id = course.id;

        await CourseVideo.create({
            course_id,
            video_link,
        })

        await Certificates.create({
            course_id,
            certificate: certificate_file_name,
        })

        return course_id;
    }

    async createCourseDescription (course_id, description) {

        JSON.parse(description).map(async desc => {
            const {descriptionTitle, descriptionItem} = desc;

            const db_titles = await DescriptionTitles.create({
                title: descriptionTitle,
                course_id,
            })

            const descriptionArray = descriptionItem.split(";")

            descriptionArray.map(async item => {
                await DescriptionContent.create({
                    description_title_id: db_titles.id,
                    description: item,
                })
            })
        })
    }

    async createCourseQuestions (course_id, questions) {
        JSON.parse(questions).map(async question_item => {
            const {question, answers} = question_item;
            const question_id = await Questions.create({
                course_id,
                question,
            })

            answers.map(async (answer_item) => {
                const {answer, is_correct} = answer_item;
                await Answers.create({
                    question_id: question_id.id,
                    answer,
                    is_correct,
                })
            })
        })
    }

}

module.exports = new CourseService();