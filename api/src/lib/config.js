const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
console.log(`Using environment file: ${envFile}`);
dotenv.config({ path: envFile });

const validator = require("Validator");
const convict = require("convict");
const externalFormats = require("convict-format-with-validator");

convict.addFormats(externalFormats);

convict.addFormat({
  name: "mongo-uri",
  validate: function (uri) {
    if (!validator.isURL(uri, { protocols: ["mongodb", "mongodb+srv"] })) {
      throw new Error("Invalid mongodb uri");
    }
  },
});

convict.addFormat({
  name: "string-array",
  validate: function (elements) {
    if (!Array.isArray(elements)) {
      throw new Error("Must be an array of strings or comma separated.");
    }
  },
  coerce: function (value) {
    if (Array.isArray(value)) return value;
    else if (typeof value === "string")
      return value.split(",").map((element) => element.trim());
    else return value;
  },
});

const config = convict({
  port: {
    doc: "The port to bind",
    format: "port",
    default: 3000,
    env: "PORT",
  },
  db: {
    doc: "MongoDB URI",
    format: "mongodb-uri",
    default: "mongodb://127.0.0.1:27017/family-unit-expenses-api",
    env: "MONGODB_URI",
  },
  corsOrigins: {
    doc: "Activated CORS Origins",
    format: "string-array",
    default: [],
    env: "CORS_ORIGINS",
  },
  session: {
    secret: {
      doc: "Session secret for cookie sign.",
      format: String,
      default: "super-secret",
      env: "SESSION_SECRET",
      sensitive: true,
    },
    cookie: {
      secure: {
        doc: "Session cookie secure flag",
        format: Boolean,
        default: false,
        env: "SESSION_COOKIE_SECURE",
      },
      httpOnly: {
        doc: "Session cookie httpOnly flag",
        format: Boolean,
        default: true,
      },
      maxDays: {
        doc: "Session cookie max age in days",
        format: Number,
        default: 7,
        env: "SESSION_COOKIE_MAX_DAYS",
      },
    },
  },
  admins: {
    doc: "System administrators user emails",
    format: "string-array",
    default: [],
    env: "ADMIN_EMAILS",
  },
});
