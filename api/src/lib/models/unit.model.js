const mongoose = require("mongoose");
const config = require("../config");
require("./unitUser.model");
require("./expense.model");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Unit name is required"],
      trim: true,
      minlength: [3, "Unit name must be at least 3 characters long"],
      maxlength: [50, "Unit name can not exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [250, "Description cannot exceed 250 characters"],
    },
    icon: {
      type: String,
      default: function() {
        return `https://picsum.photos/id/${this.name}/200/200`;
      }
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

schema.virtual("users", {
  ref: "UnitUser",
  localField: "_id",
  foreignField: "unit",
  justOne: false,
});

schema.virtual("expenses", {
  ref: "Expense",
  localField: "_id",
  foreignField: "unit",
});

const Unit = mongoose.model("Unit", schema);

module.exports = Unit;
