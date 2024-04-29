import express from "express";
import upload from "./../../middlewares/multer.js";
import {
    addEditPreferences,
    loadUser,
    login,
    logout,
    register,
    resendVerificationCode,
    updateEmail,
    updateProfile,
    verifyAccount,
} from "../../controllers/user/user.controller.js";
import auth from "../../middlewares/auth.js";

const userRoutes = express.Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/verify-account", verifyAccount);
userRoutes.post("/resend-code", resendVerificationCode);
userRoutes.post("/logout", logout);
// auth routes
userRoutes.use(auth);
userRoutes.get("/me", loadUser);
userRoutes.post("/profile-update", upload.single("file"), updateProfile);
userRoutes.post("/update-email", updateEmail);
userRoutes.post("/my/preferences", addEditPreferences);
export default userRoutes;
