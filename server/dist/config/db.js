"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const logger_1 = __importDefault(require("./logger"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(config_1.default.MONGO_URI);
        console.log("MongoDB connected");
        logger_1.default.info("MongoDB connected");
    }
    catch (error) {
        console.error("MongoDB connection failed", error);
        logger_1.default.error("MongoDB connection failed", error);
        process.exit(1);
    }
};
exports.default = connectDB;
