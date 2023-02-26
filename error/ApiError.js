// class ApiError extends Error {
//     constructor(status, message) {
//         super ();
//         this.status = status;
//         this.message = message;
//     }
//
//     static badRequest(message) {
//         return new ApiError(404, message)
//     }
//
//     static internal(message) {
//         return new ApiError(500, message)
//     }
//
//     static UnauthorizedError(message) {
//         return new ApiError(401, message)
//     }
//
//     static forbidden(message) {
//         return new ApiError(403, message)
//     }
// }
//
// module.exports = new ApiError

module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors);
    }
}