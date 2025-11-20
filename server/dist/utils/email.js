"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.SMTP_HOST,
    port: Number(config_1.default.SMTP_PORT || 587),
    secure: false,
    auth: {
        user: config_1.default.SMTP_USER,
        pass: config_1.default.SMTP_PASS,
    },
});
async function sendEmail(to, subject, html) {
    return transporter.sendMail({
        from: config_1.default.EMAIL_FROM,
        to,
        subject,
        html,
    });
}
