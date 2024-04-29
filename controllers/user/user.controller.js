import TryCatch from "../../utils/TryCatch.js";
import CustomErrorHanlder from "../../utils/CustomErrorHandler.js";
import User from "../../models/user.js";
import cloudinaryServices from "../../utils/cloudinary.js";
import sendMail from "./../../services/sendMail.js";
import sendToken from "./../../utils/token.js";
import generateOtp from "../../utils/generateOtp.js";

export const register = TryCatch(async (req, res, next) => {
    const { name, email, password } = req.body;

    // const filePath = req.file;

    if (!name || !email || !password) {
        return next(CustomErrorHanlder.badRequest("Please provide all fields"));
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(CustomErrorHanlder.badRequest("Email already exists"));
    }

    const otp = generateOtp();
    const otpExp = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
        name,
        email,
        password,
        code: otp,
        codeExp: otpExp,
    });

    const createdUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
    };

    sendToken(res, createdUser, 200, "Registered successfully");

    // send verification email to user
    try {
        await sendMail({
            email: user.email,
            subject: "Verify your account",
            message: `Your verification code is ${otp}`,
        });
    } catch (err) {
        user.code = undefined;
        user.codeExp = undefined;
        user.save();
        next(err);
    }
});

export const login = TryCatch(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            CustomErrorHanlder.badRequest("Email id and password is required")
        );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(CustomErrorHanlder.badRequest("Invalid email or password"));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(CustomErrorHanlder.badRequest("Invalid email or password"));
    }

    sendToken(res, user, 200, "Login successful");
});

export const verifyAccount = TryCatch(async (req, res, next) => {
    const { code, email } = req.body;

    if (!code || !email) {
        return next(CustomErrorHanlder.badRequest("Please provide all fields"));
    }

    const user = await User.findOne({
        email,
    });

    if (!user) {
        return next(CustomErrorHanlder.badRequest("User not found"));
    }

    if (user.code === code && user.codeExp > Date.now()) {
        return next(
            CustomErrorHanlder.badRequest("Invalid code or code is expired")
        );
    }

    user.isAccountVerified = true;
    user.code = undefined;
    user.codeExp = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Account verified successfully",
    });
});

export const logout = TryCatch(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        message: "logged out successfully",
    });
});

export const resendVerificationCode = TryCatch(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            CustomErrorHanlder.notFound("User not found with this email id")
        );
    }

    const otp = generateOtp();
    // set expiry time to 10 minutes
    const otpExp = new Date(Date.now() + 10 * 60 * 1000);

    user.code = otp;
    user.codeExp = otpExp;

    await user.save();

    // send verification email to user
    try {
        await sendMail({
            email: user.email,
            subject: "Verify your account",
            message: `Your verification code is ${otp}`,
        });
    } catch (err) {
        user.code = undefined;
        user.codeExp = undefined;
        user.save();
        next(err);
    }

    res.status(200).json({
        success: true,
        message: "Verification code sent successfully",
    });
});

export const loadUser = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);

    res.status(200).json({
        success: true,
        user,
    });
});

export const updateProfile = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);

    if (!user) {
        return next(CustomErrorHanlder.notFound("User not found"));
    }

    const { name, gender, languageKnown, city, contact } = req.body;

    if (req.file) {
        const filePath = req.file.path;
        const { public_id, url } = await cloudinaryServices.upload(filePath);

        user.avatar = {
            public_id,
            url,
        };
    }

    user.name = name;
    user.gender = gender;
    user.languageKnown = languageKnown;
    user.city = city;
    user.contact = contact;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
    });
});

export const updateEmail = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);

    if (!user) {
        return next(CustomErrorHanlder.notFound("User not found"));
    }

    const { email } = req.body;

    if (!email) {
        return next(CustomErrorHanlder.badRequest("Email is required"));
    }

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
        return next(CustomErrorHanlder.badRequest("Email already exists"));
    }

    const otp = generateOtp();
    const otpExp = new Date(Date.now() + 10 * 60 * 1000);

    user.isAccountVerified = false;
    user.email = email;

    try {
        await sendMail({
            email: user.email,
            subject: "Verify your account",
            message: `Your verification code is ${otp}`,
        });

        user.code = otp;
        user.codeExp = otpExp;
    } catch (err) {
        user.code = undefined;
        user.codeExp = undefined;
        await user.save();
        next(err);
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: "Email updated successfully",
    });
});

export const addEditPreferences = TryCatch(async (req, res, next) => {
    const user = await User.findById(req.user);

    if (!user) {
        return next(CustomErrorHanlder.notFound("User not found"));
    }

    const { careerPreference, workPreference } = req.body;

    user.careerPreference = careerPreference;
    user.workPreference = workPreference;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Preferences updated successfully",
    });
});
