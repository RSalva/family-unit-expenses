const mongoose = require("mongoose");
const config = require("../config");

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [3, "Description must be at least 3 characters long"],
      maxlength: [50, "Description can not exceed 50 characters"],
    },
    cost: {
      type: Number,
      required: [true, "Description is required"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    users: {
      type: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      }],
      validate: [arrayLimit, '{PATH} exceeds the limit of 50']
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

function arrayLimit(val) {
  return val.length <= 50;
}

const Expense = mongoose.model("Expense", schema);

module.exports = Expense;
