const createError = require("http-errors");
const Unit = require("../../lib/models/unit.model");
const UnitUser = require("../../lib/models/unitUser.model");

const UnitNotFound = createError(404, "unit not found");
const UnitAlreadyExists = createError(409, {
  message: "Unit validation failed: unit: Unit already exists",
  errors: { unit: "Unit already exists" },
});

module.exports.listAll = async (req, res, next) => {
  const units = await Unit.find()
    .populate("users");
  res.json(units);
};

module.exports.list = async (req, res, next) => {
  const unitsFound = await UnitUser.find({ user: req.sessionUser.id })
    .populate("unit");
  const unitIdsFound = unitsFound.map((unit) => unit.unit.id);
  // .populate("users") if needs to users information
  const units = await Unit.find({ _id: {$in: unitIdsFound} });
  res.json(units);
};

module.exports.detail = async (req, res, next) => {
  const criteria = { unit: req.params.id, user: req.sessionUser.id };
  const unitUserExists = await UnitUser.findOne(criteria);

  if (!unitUserExists) throw(UnitNotFound);
  const unit = await Unit.findOne({ _id: req.params.id })
    .populate("users");
  if (unit) {
    res.json(unit);
  }
  else next(UnitNotFound);
};

module.exports.create = async (req, res, next) => {
  let unitUser = await  UnitUser.find({ role: "creator", user: req.sessionUser.id}).populate("unit");
  if (unitUser.some((unitUser) => unitUser.unit.name === req.body.name)) throw UnitAlreadyExists;

  const unit = await Unit.create({
    name: req.body.name,
    description: req.body.description,
  });

  unitUser = await UnitUser.create({
    user: req.sessionUser.id,
    unit: unit.id,
    role: "creator",
    joinedAt: req.body.date,
  });

  res.status(201).json(unit);
};

module.exports.update = async (req, res, next) => {
  const permittedParams = ["description", "email"];

  // never trust input data. whitelist params!!!
  Object.keys(req.body).forEach((key) => {
    if (!permittedParams.includes(key)) {
      delete req.body[key];
    }
  });

  if (req.file) {
    req.body.avatar = req.file.path;
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (user) res.json(user);
  else next(UserNotFound);
};