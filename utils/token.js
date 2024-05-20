import jwt from "jsonwebtoken";
const sendToken = (
    res,
    user,
    statusCode,
    message,
    exp = process.env.COOKIE_EXPIRE
) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
        expires: new Date(Date.now() + exp * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    return res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
        user,
    });
};

export default sendToken;
