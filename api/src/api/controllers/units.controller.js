const createError = require("http-errors");
const Unit = require("../../lib/models/unit.model");
const UnitUser = require("../../lib/models/unitUser.model");

const UnitNotFound = createError(404, "unit not found");

const UnitOrUserNotFound = createError(409, {
  message: "Unit validation failed: unit: Unit or user do not exists",
  errors: { unit: "Unit or user do not exists" },
});

const UnitAlreadyExists = createError(409, {
  message: "Unit validation failed: unit: Unit already exists",
  errors: { unit: "Unit already exists" },
});

const UserAlreadyExists = createError(409, {
  message: "Unit validation failed: unit: User already exists",
  errors: { unit: "User already exists" },
});

const UserNotInUnit = createError(404, {
  message: "UnitUser validation failed: unitUser: User not found in that unit",
  errors: { unitUser: "User not found in that unit" },
});

const ForbiddenAction = createError(403, {
  message: "Forbidden action: unitUser: Does not have the permission to do that",
  errors: { unitUser: "Does not have the permission to do that" },
});

module.exports.listAll = async (req, res, next) => {
  const units = await Unit.find()
    .populate("users");
  res.json(units);
};

module.exports.list = async (req, res, next) => {
  const unitsFound = await UnitUser.find({ user: req.sessionUser.id });
    //.populate("unit");
  const unitIdsFound = unitsFound.map((userUnit) => userUnit.unit);
  // .populate("users") if needs to users information
  const units = await Unit.find({ _id: {$in: unitIdsFound} });
  res.json(units);
};

module.exports.detail = async (req, res, next) => {
  const criteria = { unit: req.params.id, user: req.sessionUser.id };
  const unitUserExists = await UnitUser.findOne(criteria);

  if (!unitUserExists) throw(UnitOrUserNotFound);

  const unit = await Unit.findOne({ _id: req.params.id })
    .populate("users");
  if (unit) res.json(unit);
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

  const unit = await Unit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (user) res.json(user);
  else next(UserNotFound);
};

module.exports.addUser = async (req, res, next) => {
  const { userId } = req.body;
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId);
  if (!unit) throw(UnitNotFound);

  const user = await UnitUser.findOne({ unit: unitId, user: userId });
  if (user) throw(UserAlreadyExists);
  
  if (! await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) throw(ForbiddenAction);

  const newUnitUser = await UnitUser.create({
    user: userId,
    unit: unitId,
    role: "member",
    joinedAt: Date.now(),
  });

  res.status(201).json(newUnitUser);
};

module.exports.removeUser = async (req, res, next) => {
  const unitId = req.params.id;
  const userId = req.params.userId;

  const unit = await Unit.findById(unitId);
  if (!unit) throw(UnitNotFound);

  if (! await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) throw(ForbiddenAction);

  const userUnit = await UnitUser.findOneAndDelete({ unit: unitId, user: userId });
  if (!userUnit) throw(UserNotInUnit);
  else res.status(204).send();
};

module.exports.delete = async (req, res, next) => {
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId);
  if (!unit) throw(UnitNotFound);

  if (! await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) throw(ForbiddenAction);
  
  await UnitUser.deleteMany({ unit: unitId });
  await Unit.findByIdAndDelete(unitId);
  res.status(204).send();
};

// Function to check if a user has permission in a unit
const userHasPermission = async (userId, unitId, roles) {
  const userUnit = await UnitUser.findOne({ unit: unitId, user: userId });
  return userUnit && roles.includes(userUnit.role);
}