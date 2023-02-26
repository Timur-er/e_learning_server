const sequelize = require('../dataBase')
const { DataTypes, Sequelize} = require('sequelize')

const Users = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    full_name: {type: DataTypes.STRING,},
    birth_date: {type: DataTypes.STRING},
    phone_number: {type: DataTypes.STRING},
    password: {type: DataTypes.STRING},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
})

const Enrollments = sequelize.define('enrollment', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER},
    course_id: {type: DataTypes.INTEGER},
    start_date: {type: DataTypes.STRING},
    end_date: {type: DataTypes.STRING},
    attempts: {type: DataTypes.INTEGER, defaultValue: 0},
    is_complete: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_paid: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const Courses = sequelize.define('course', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_name: {type:DataTypes.STRING},
    price: {type: DataTypes.INTEGER},
    short_description: {type: DataTypes.TEXT},
    lector_id: {type: DataTypes.INTEGER},
    image: {type: DataTypes.STRING},
    rating: {type: DataTypes.INTEGER, defaultValue: 0},
    total_enrollments: {type: DataTypes.INTEGER, defaultValue: 0},
    course_duration: {type: DataTypes.INTEGER},
    attempts: {type: DataTypes.INTEGER},
    percentage: {type: DataTypes.INTEGER},
    course_level_id: {type: DataTypes.INTEGER},
    course_area_id: {type: DataTypes.INTEGER}
})

const CourseVideo = sequelize.define('courseVideo', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_id: {type: DataTypes.STRING},
    video_link: {type: DataTypes.STRING}
})

const CourseArea = sequelize.define('courseArea', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    area: {type: DataTypes.STRING}
})

const CourseLevel = sequelize.define('corseLevel', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    level: {type: DataTypes.STRING},
})

const DescriptionTitles = sequelize.define('description_title', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    course_id: {type: DataTypes.INTEGER},
})

const DescriptionContent = sequelize.define('description_content', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description_title_id: {type: DataTypes.INTEGER},
    description: {type: DataTypes.TEXT}
})

const Questions = sequelize.define('question', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_id: {type: DataTypes.INTEGER},
    question: {type: DataTypes.STRING}
})

const Answers =  sequelize.define('answer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    question_id: {type: DataTypes.INTEGER},
    answer: {type: DataTypes.STRING},
    is_correct: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const UserTokens = sequelize.define('userTokens', {
    user_id: {type: DataTypes.INTEGER},
    refresh_token: {type: DataTypes.STRING, required: true}
})

const Lector = sequelize.define('lector', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    lector_name: {type: DataTypes.STRING},
    short_description: {type: DataTypes.TEXT}
})

const Certificates = sequelize.define('certificates', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_id: {type: DataTypes.INTEGER},
    certificate: {type: DataTypes.STRING},
})

const FavouriteCourses = sequelize.define('favouriteCourses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    course_id: {type: DataTypes.INTEGER},
    user_id: {type: DataTypes.INTEGER},
})

Courses.hasMany(Questions, { foreignKey: 'course_id' });
Questions.belongsTo(Courses, { foreignKey: 'course_id' });

Questions.hasMany(Answers, { foreignKey: 'question_id' });
Answers.belongsTo(Questions, { foreignKey: 'question_id' });

// Users.hasMany(Enrollments, { foreignKey: 'user_id' });
// Enrollments.belongsTo(Users, { foreignKey: 'user_id' });
//
// Courses.hasMany(Enrollments, { foreignKey: 'course_id' });
// Enrollments.belongsTo(Courses, { foreignKey: 'course_id' });
//
// Courses.hasOne(CourseVideo, { foreignKey: 'course_id' });
// CourseVideo.belongsTo(Courses, { foreignKey: 'course_id' });
//
// Courses.belongsTo(CourseLevel, { foreignKey: 'course_level_id' });
// CourseLevel.hasMany(Courses, { foreignKey: 'course_level_id' });
//
// Courses.belongsTo(CourseArea, { foreignKey: 'course_area_id' });
// CourseArea.hasMany(Courses, { foreignKey: 'course_area_id' });
//
// Courses.belongsTo(Lector, { foreignKey: 'lector_id' });
// Lector.hasMany(Courses, { foreignKey: 'lector_id' });
//
// DescriptionTitles.hasMany(DescriptionContent, { foreignKey: 'description_title_id' });
// DescriptionContent.belongsTo(DescriptionTitles, { foreignKey: 'description_title_id' });
//
// Courses.hasMany(DescriptionTitles, { foreignKey: 'course_id' });
// DescriptionTitles.belongsTo(Courses, { foreignKey: 'course_id' });
//
// Questions.hasMany(Answers, { foreignKey: 'question_id' });
// Answers.belongsTo(Questions, { foreignKey: 'question_id' });
//
// Courses.hasMany(Questions, { foreignKey: 'course_id' });
// Questions.belongsTo(Courses, { foreignKey: 'course_id' });
//
// Users.hasMany(UserTokens, { foreignKey: 'user_id' });
// UserTokens.belongsTo(Users, { foreignKey: 'user_id' });
//
// Courses.hasMany(Certificates, { foreignKey: 'course_id' });
// Certificates.belongsTo(Courses, { foreignKey: 'course_id' });


module.exports = {
    Users,
    Enrollments,
    Courses,
    DescriptionTitles,
    DescriptionContent,
    Questions,
    Answers,
    UserTokens,
    Lector,
    Certificates,
    CourseLevel,
    CourseVideo,
    CourseArea,
    FavouriteCourses,
}