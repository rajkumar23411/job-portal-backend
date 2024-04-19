import CustomErrorHanlder from "../utils/CustomErrorHandler.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: "Internal Server Error",
        ...(process.env.DEBUG_MODE === "true" && {
            originalError: err.message,
        }),
    };

    if (err instanceof CustomErrorHanlder) {
        statusCode = err.statusCode;
        data = {
            message: err.message,
        };
    }

    return res.status(statusCode).json({
        sucess: false,
        ...data,
    });
};

export default errorHandler;
