const jwt = require('jsonwebtoken')
const ApiError = require('../error/ApiError');
const tokenService = require('../service/token-service');

module.exports = async function(req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const accessToken = req.headers.authorization.split(' ')[1];

        if (!accessToken) {
            return next(ApiError.unauthorizedError('Пользователь не авторизован'))
        }

        const userData = await tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unauthorizedError('Пользователь не авторизован'))
        }
        req.user = userData;
        next()
    } catch (e) {
        return next(ApiError.unauthorizedError('Пользователь не авторизован'))
    }
}