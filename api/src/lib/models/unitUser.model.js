const mongoose = require("mongoose");
const config = require("config");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: [true, "Unit is required"],
    },
    role: {
      type: String,
      enum: ["member", "admin", "creator"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    }
  }
);

const UnitUser = mongoose.model("UnitUser", schema);

module.exports = UnitUser;