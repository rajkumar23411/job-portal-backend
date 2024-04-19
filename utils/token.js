import jwt from "jsonwebtoken";
const sendToken = (res, user, statusCode, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };
    return res.status(statusCode).cookie("token", token, options).json({
        success: true,
        message,
    });
};

export default sendToken;
