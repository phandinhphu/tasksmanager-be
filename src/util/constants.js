const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET
    ? process.env.JWT_SECRET
    : (() => {
          throw new Error("JWT_SECRET chưa được định nghĩa trong file .env");
      })();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN
    ? process.env.JWT_EXPIRES_IN
    : "1d";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI
    ? process.env.MONGODB_URI
    : (() => {
          throw new Error("MONGODB_URI chưa được định nghĩa trong file .env");
      })();
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
    ? process.env.MONGODB_PASSWORD
    : (() => {
          throw new Error(
              "MONGODB_PASSWORD chưa được định nghĩa trong file .env"
          );
      })();

const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME
    ? process.env.CLOUDINARY_NAME
    : (() => {
          throw new Error(
              "CLOUDINARY_NAME chưa được định nghĩa trong file .env"
          );
      })();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY
    ? process.env.CLOUDINARY_API_KEY
    : (() => {
          throw new Error(
              "CLOUDINARY_API_KEY chưa được định nghĩa trong file .env"
          );
      })();
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET
    ? process.env.CLOUDINARY_API_SECRET
    : (() => {
          throw new Error(
              "CLOUDINARY_API_SECRET chưa được định nghĩa trong file .env"
          );
      })();

const GMAIL_USER = process.env.GMAIL_USER
    ? process.env.GMAIL_USER
    : (() => {
          throw new Error("GMAIL_USER chưa được định nghĩa trong file .env");
      })();
const GMAIL_PASS = process.env.GMAIL_PASS
    ? process.env.GMAIL_PASS
    : (() => {
          throw new Error("GMAIL_PASS chưa được định nghĩa trong file .env");
      })();

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL
    ? process.env.GOOGLE_CALLBACK_URL
    : (() => {
          throw new Error(
              "GOOGLE_CALLBACK_URL chưa được định nghĩa trong file .env"
          );
      })();
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    ? process.env.GOOGLE_CLIENT_ID
    : (() => {
          throw new Error(
              "GOOGLE_CLIENT_ID chưa được định nghĩa trong file .env"
          );
      })();
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    ? process.env.GOOGLE_CLIENT_SECRET
    : (() => {
          throw new Error(
              "GOOGLE_CLIENT_SECRET chưa được định nghĩa trong file .env"
          );
      })();

const FB_CALLBACK_URL = process.env.FB_CALLBACK_URL
    ? process.env.FB_CALLBACK_URL
    : (() => {
          throw new Error(
              "FB_CALLBACK_URL chưa được định nghĩa trong file .env"
          );
      })();
const FB_APP_ID = process.env.FB_APP_ID
    ? process.env.FB_APP_ID
    : (() => {
          throw new Error("FB_APP_ID chưa được định nghĩa trong file .env");
      })();
const FB_APP_SECRET = process.env.FB_APP_SECRET
    ? process.env.FB_APP_SECRET
    : (() => {
          throw new Error("FB_APP_SECRET chưa được định nghĩa trong file .env");
      })();

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
    ? process.env.RECAPTCHA_SECRET_KEY
    : (() => {
          throw new Error(
              "RECAPTCHA_SECRET_KEY chưa được định nghĩa trong file .env"
          );
      })();
const EMAIL_ADMIN = process.env.EMAIL_ADMIN
    ? process.env.EMAIL_ADMIN
    : (() => {
          throw new Error("EMAIL_ADMIN chưa được định nghĩa trong file .env");
      })();

module.exports = {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    BASE_URL,
    FRONTEND_URL,
    PORT,
    MONGODB_URI,
    MONGODB_PASSWORD,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    GMAIL_USER,
    GMAIL_PASS,
    GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FB_CALLBACK_URL,
    FB_APP_ID,
    FB_APP_SECRET,
    RECAPTCHA_SECRET_KEY,
    EMAIL_ADMIN,
};
