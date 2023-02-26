require('dotenv').config()
const cookieParser = require('cookie-parser');
const express = require('express')
const sequelize = require('./dataBase')
const models = require('./models/models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')

const options = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}

const app = express()
app.use(cors(options));
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use(cookieParser());

app.use('/api', router)

app.use(errorHandler)
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(process.env.PORT, () => {
            console.log(`Server started in port ${process.env.PORT}`)
        })
    } catch (e) {
        console.log(e);
    }
}

start()