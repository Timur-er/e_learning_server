const {Users: user_model} = require('../models/models')
const uuid = require('uuid');
// const mailService = require('./mail-service');
const TokenService = require('./token-service');
const bcrypt = require('bcrypt');
const ApiError = require('../error/ApiError')

class UserService {
    async registration(email, name, phone_number, birth_date, password) {
        console.log('user service registration');
        const candidate = await user_model.findOne({where: {email: email}});
        console.log('candidate = ', candidate);
        if (candidate) {
            throw new Error('This email is already taken!');
        }
        const hash_password = await bcrypt.hash(password, 4);
        // const activation_link = uuid.v4();

        const user = await user_model.create({
            email,
            full_name: name,
            birth_date,
            phone_number,
            password: hash_password,
            role: 'USER',
        })
        // await mailService.sendActivationLink(email, `${process.env.API_URL}/api/user/activate/${activation_link}`);
        const tokens = await TokenService.generateTokens({id: user.id, email, full_name: name}) //payload: email, id, shopAddress, else...
        await TokenService.saveToken(user.id, tokens.refresh_token);
        return { ...tokens, user: {user_id: user.id, email, name, birth_date, phone_number, role: user.role}}
    }

    async login (email, password) {
        const user = await user_model.findOne({where: {email}});
        if (!user) {
            throw ApiError.badRequest('Пользователь с таким email не найден');
        }

        const compare_passwords = await bcrypt.compare(password, user.password);
        if (!compare_passwords) {
            throw ApiError.badRequest('Не коректный пароль');
        }
        const {id, full_name, phone_number, birth_date, role} = user;
        const tokens = await TokenService.generateTokens({id, email, full_name});
        await TokenService.saveToken(id, tokens.refresh_token);
        return {...tokens, user: {user_id: id, role, email, full_name, phone_number, birth_date,}}
    }

    async activate(activation_link) {
        const user = await user_model.findOne({where: {activation_link}});
        if (!user) {
            throw new Error('incorrect link');
        }
        await user_model.update({is_activated: true}, {where: {activation_link}});
    }

    async logout(refresh_token) {
        const token = await TokenService.removeToken(refresh_token);
        return token;
    }

    async refresh(refresh_token) {
        if (!refresh_token) {
            throw ApiError.UnauthorizedError()
        }

        const user_data = await TokenService.validateRefreshToken(refresh_token);
        const token_from_db = await TokenService.findToken(refresh_token);
        if (!user_data || !token_from_db) {
            throw ApiError.UnauthorizedError()
        }
        const user = await user_model.findOne({where: {id: user_data.id}})
        const {id, email, name, phone_number, birth_date, role} = user;
        const tokens = await TokenService.generateTokens({id, email, name});
        await TokenService.saveToken(user.id, tokens.refresh_token);
        return {...tokens, user: {user_id: user.id, email, name, phone_number, birth_date, role}}
    }

    async getAllUsers() {
        const users = await user_model.findAll();
        return users;
    }

    async changeUserRole (user_id, role) {
        const user = await user_model.update({role}, {where: {id:user_id}})
        return {user, message: 'Role was changed'};
    }
}

module.exports = new UserService();