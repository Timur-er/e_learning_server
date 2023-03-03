const sequelize = require('../dataBase')
const { DataTypes } = require('sequelize')

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
    real_price: {type: DataTypes.INTEGER},
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
    course_area_id: {type: DataTypes.INTEGER},
    labels_id: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
    previous_price: {type: DataTypes.INTEGER},
})

const CourseLabels = sequelize.define('courseLabel', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    label: {type: DataTypes.STRING},
})

const DiscountCodes = sequelize.define('dicountCode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING, unique: true},
    discount_type: {type: DataTypes.STRING},
    discount: {type: DataTypes.STRING},
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
    short_description: {type: DataTypes.TEXT},
    lector_link: {type: DataTypes.STRING}
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
    CourseLabels,
    DiscountCodes,
}