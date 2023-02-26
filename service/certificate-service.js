const { Image, createCanvas} = require('canvas')
const fs = require('fs')
const {Users, Courses, Enrollments} = require("../models/models");

class CertificateService {
    async generateCertificate(course_id, user_id) {

        const user = await Users.findOne({where: {id: user_id}});
        const course = await Courses.findOne({where: {id: course_id}});
        const enrollment = await Enrollments.findOne({where: {course_id, user_id}})

        const image = new Image();
        image.src = `${__dirname}/../static/template.jpg`
        const canvas = createCanvas(image.width, image.height)
        const ctx = canvas.getContext("2d");
        ctx.font = '100px Impact';
        ctx.drawImage(image, 0, 0, image.width, image.height)
        ctx.fillStyle = 'rgb(0,0,0)'
        // const text = ctx.measureText('Timur Erkimbaiev')
        ctx.textAlign = 'center';
        ctx.fillText(user.full_name, (image.width) - 1800, (image.height) - 1180);
        ctx.fillText(enrollment.id, (image.width) - 1800, (image.height) - 1600);
        ctx.fillText(course.course_name, (image.width) - 1800, (image.height) - 800);
        ctx.fillText('2023', (image.width) - 1800, (image.height) - 575);
        ctx.fillText(enrollment.end_date, (image.width) - 3000, (image.height) - 350);

        const url = canvas.toDataURL('image/jpeg')
        return url;
    }
}

module.exports = new CertificateService();