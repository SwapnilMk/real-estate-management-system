import app from "./app";
import config from "./config/config";
import { connectDB } from "./config/db";

const startServer = async () => {
    await connectDB();

    app.listen(config.port, () => {
        console.log(`Server running at http://localhost:${config.port}`);
    });
};

startServer();
