const mongoose = require("mongoose");
const config = require("../config");

const bcrypt = require("bcryptjs");
const SALT_WORK_FACTOR = 10;
const EMAIL_PATTERN =
  /^(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\[(?:(?:IPv6:[a-fA-F0-9:.]+)|(?:\d{1,3}\.){3}\d{1,3})\]))$/;

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username can not exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9._-]+$/,
        "Username can only contain letters, numbers, dot, hyphen and underscore",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name can not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "Email format is not correct"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [128, "Username can not exceed 128 characters"],
    },
    avatar: {
      type: String,
      default: function() {
        return `https://avatar.iran.liara.run/username?username=${this.username}`;
      }
    },
    role: {
      type: String,
      enum: ["admin", "guest"],
      default: "guest",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.password; // Do not expose password
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

schema.pre("save", function (next) {
  const user = this;

  if (user.role === "guest" && config.get("admins").includes(user.email)) {
    user.role = "admin";
  }

  if (user.isModified("password")) {
    bcrypt
      .hash(user.password, SALT_WORK_FACTOR)
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

schema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", schema);

module.exports = User;