class CustomErrorHanlder extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

    static badRequest(message = "Bad Request") {
        return new CustomErrorHanlder(400, message);
    }

    static required(message = "All fields are required") {
        return new CustomErrorHanlder(400, message);
    }

    static notFound(message = "Not Found") {
        return new CustomErrorHanlder(404, message);
    }

    static incorrectCredentials(message = "Incorrect Credentials") {
        return new CustomErrorHanlder(401, message);
    }
    static unAuthorized(message = "Unauthorized") {
        return new CustomErrorHanlder(401, message);
    }

    static serverError(message = "Internal Server Error") {
        return new CustomErrorHanlder(500, message);
    }
}

export default CustomErrorHanlder;
