import dotenv from "dotenv";
dotenv.config();

export default {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI as string,
    nodeEnv: process.env.NODE_ENV || "development",
};
