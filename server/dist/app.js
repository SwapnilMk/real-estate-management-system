"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_2 = require("./config/cors");
const routes_1 = __importDefault(require("./routes"));
const rate_limit_1 = require("./config/rate-limit");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(rate_limit_1.limiter);
// all api routes
app.use("/api/v1", routes_1.default);
// Fallback 404 route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        route: req.originalUrl,
    });
});
exports.default = app;
