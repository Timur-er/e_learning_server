const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const { Users } = require('../models/models')
const userService = require('../service/user-service')

const cookieConfig = {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'none',
    secure: true,
    httpOnly: true,
}

class UserController {
    async registration(req, res) {
        try {
            const { email, name, phone_number, birth_date, password} = req.body;
            const user_data = await userService.registration(email, name, phone_number, birth_date, password)
            res.cookie('refresh_token', user_data.refresh_token, cookieConfig);
            return res.json(user_data);
        } catch (e) {
            console.log(e);
        }
    }

    async login(req, res, next){
        try {
            const {email, password} = req.body;
            const user_data = await userService.login(email, password);
            res.cookie('refresh_token', user_data.refresh_token, cookieConfig);
            return res.json(user_data);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refresh_token} = req.cookies;
            const userData = await userService.refresh(refresh_token);
            res.cookie('refresh_token', userData.refresh_token, cookieConfig);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async changeUserRole(req, res, next) {
        try {
            const {user_id, new_role} = req.body;
            console.log(req.body);
            const new_user = await userService.changeUserRole(user_id, new_role);
            return res.json(new_user);
        } catch (e) {
            next(e);
        }
    }

    async getAllUsers(req, res) {
        const users = await Users.findAll();
        return res.json(users)
    }

}


module.exports = new UserController()