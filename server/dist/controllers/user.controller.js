"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateUserProfile = exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const getUsers = async (req, res) => {
    try {
        const users = await (0, user_service_1.getAllUsers)();
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};
exports.getUsers = getUsers;
const updateUserProfile = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?.id || user?._id;
        let avatarUrl = undefined;
        if (req.file) {
            const result = await (0, upload_middleware_1.uploadToCloudinary)(req.file);
            avatarUrl = result.secure_url;
        }
        const updateData = {
            ...req.body,
            ...(avatarUrl && { avatar: avatarUrl }),
        };
        const updatedUser = await (0, user_service_1.updateUserService)(userId, updateData);
        res.json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateUserProfile = updateUserProfile;
const changePassword = async (req, res) => {
    try {
        const user = req.user;
        const userId = user?.id || user?._id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        await (0, user_service_1.changePasswordService)(userId, currentPassword, newPassword);
        res.json({ message: "Password changed successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.changePassword = changePassword;
