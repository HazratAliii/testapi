"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello world" });
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: "sfjsldkfjsldfkjlsdkj", // Keep this secret in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // Use 'true' in production (requires HTTPS)
        maxAge: 24 * 60 * 60 * 1000, // 1 day session expiry
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1/users", users_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
mongoose_1.default
    .connect(process.env.MONGODB_URI)
    .then(() => {
    // app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    // });
})
    .catch((e) => {
    console.log(e);
});
