const createError = require("http-errors");
const Unit = require("../../lib/models/unit.model");
const UnitUser = require("../../lib/models/unitUser.model");

const UnitNotFound = createError(404, "unit not found");
const UnitAlreadyExists = createError(409, {
  message: "Unit validation failed: unitId: Unit already exists",
  errors: { unitId: "Unit already exists" },
});

module.exports.list = async (req, res, next) => {
  const units = await Unit.find()
    .populate("users");
  res.json(units);
};

module.exports.detail = async (req, res, next) => {
  const criteria = { _id: req.params.id, user: req.sessionUser.id };
  const unit = await Unit.findOne(criteria)
    .populate("users");

  if (unit) res.json(unit);
  else next(UnitNotFound);
};

module.exports.create = async (req, res, next) => {
  const unit = await Unit.create({
    name: req.body.name,
    description: req.body.description,
  });

  const unitUser = await UnitUser.create({
    user: req.sessionUser.id,
    unit: unit.id,
    role: "creator",
    joinedAt: req.body.date,
  });

  res.status(201).json(unit);
};


