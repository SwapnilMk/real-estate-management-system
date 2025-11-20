"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const user_service_1 = require("../services/user.service");
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
