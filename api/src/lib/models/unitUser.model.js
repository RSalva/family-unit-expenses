const mongoose = require("mongoose");
const config = require("../config");

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
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.unitUserReferenceId = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);


const UnitUser = mongoose.model("UnitUser", schema);

module.exports = UnitUser;