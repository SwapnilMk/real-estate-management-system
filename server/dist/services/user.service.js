"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordService = exports.updateUserService = exports.getAllUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getAllUsers = async () => {
    return await user_model_1.default.find({}).select("-password");
};
exports.getAllUsers = getAllUsers;
const updateUserService = async (userId, data) => {
    const user = await user_model_1.default.findByIdAndUpdate(userId, { $set: data }, { new: true, runValidators: true }).select("-password");
    if (!user)
        throw new Error("User not found");
    return user;
};
exports.updateUserService = updateUserService;
const changePasswordService = async (userId, currentPassword, newPassword) => {
    const user = await user_model_1.default.findById(userId);
    if (!user)
        throw new Error("User not found");
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
        throw new Error("Current password is incorrect");
    // Update password
    user.password = newPassword;
    await user.save();
    return true;
};
exports.changePasswordService = changePasswordService;
