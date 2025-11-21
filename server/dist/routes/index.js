"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./auth.routes"));
const property_routes_1 = __importDefault(require("./property.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const interest_routes_1 = __importDefault(require("./interest.routes"));
const contact_routes_1 = __importDefault(require("./contact.routes"));
const router = express_1.default.Router();
// authentication Routes
router.use("/auth", auth_routes_1.default);
router.use("/", property_routes_1.default); // Properties routes include /properties prefix
router.use("/users", user_routes_1.default);
router.use("/", interest_routes_1.default); // Interest routes include their own prefixes
router.use("/", contact_routes_1.default); // Contact routes
exports.default = router;
