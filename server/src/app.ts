import express from "express";
import config from "./config/config";
import { connectDB } from "./config/db";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server running...");
});

connectDB();

app.listen(config.port, () => {
    console.log(`Server started at http://localhost:${config.port}`);
});

export default app;

