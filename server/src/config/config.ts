import "dotenv/config";

// import all env files
export default {
  PORT: process.env.PORT!,
  NODE_ENV: process.env.NODE_ENV!,
  MONGO_URI: process.env.MONGO_URI!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: process.env.SMTP_PORT!,
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  EMAIL_FROM: process.env.EMAIL_FROM!,
};
