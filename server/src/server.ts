import app from "./app";
import config from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
  // db connection
  await connectDB();

  app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
  });
};

startServer();
