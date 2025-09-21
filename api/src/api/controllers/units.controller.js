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
    .populate({ 
      path: "users", 
      populate: { path: "user", select: "username avatar" }
    })
    .populate("expenses");
  if (unit) res.json(unit);
  else next(UnitNotFound);
};

module.exports.create = async (req, res, next) => {
  const { users, userId } = req.body;
  let unitUser = await  UnitUser.find({ role: "creator", user: req.sessionUser.id}).populate("unit");
  if (unitUser.some((unitUser) => unitUser.unit.name === req.body.name)) throw UnitAlreadyExists;

  console.log("Data received to create a unit:", req.body);
  
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
  
  if (users && users.length > 0) {
    req.params.id = unit.id;
    const addedUsers = [];
    for (const user of users) {
      const existingUser = await UnitUser.findOne({ unit: unit.id, user: user.id });
      if (existingUser) {
        console.log(`User ${user.id} already exists in the unit.`);
        continue; // Skip if the user is already in the unit
      }

      const newUnitUser = await UnitUser.create({
        user: user.id,
        unit: unit.id,
        role: "member",
        joinedAt: Date.now(),
      });

      addedUsers.push(newUnitUser);
    }
  }

  res.status(201).json(unit);
};

module.exports.update = async (req, res, next) => {
  const permittedParams = ["description", "name"];

  // never trust input data. whitelist params!!!
  Object.keys(req.body).forEach((key) => {
    if (!permittedParams.includes(key)) {
      delete req.body[key];
    }
  });

  if (req.file) {
    req.body.icon = req.file.path;
  }

  const unit = await Unit.findById(req.params.id);
  if (!unit) {
    return next(UnitNotFound);
  }

  const updatedUnit = await Unit.findByIdAndUpdate(
    req.params.id,
    {
      description: req.body.description || unit.description,
      name: req.body.name || unit.name,
      icon: req.body.icon || unit.icon,
    },
    { new: true, runValidators: true }
  );
  if (updatedUnit) res.status(200).json(updatedUnit);
  else next(UnitNotFound);
};

module.exports.addUsers = async (req, res, next) => {
  const { users, userId } = req.body;
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId);
  if (!unit) throw(UnitNotFound);

  const user = await UnitUser.findOne({ unit: unitId, user: userId });
  if (user) throw(UserAlreadyExists);
  
  if (! await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) throw(ForbiddenAction);

  const addedUsers = [];
  for (const user of users) {
    const existingUser = await UnitUser.findOne({ unit: unitId, user: user.id });
    if (existingUser) {
      console.log(`User ${user.id} already exists in the unit.`);
      continue; // Skip if the user is already in the unit
    }

    const newUnitUser = await UnitUser.create({
      user: user.id,
      unit: unitId,
      role: "member",
      joinedAt: Date.now(),
    });

    addedUsers.push(newUnitUser);
  }

  res.status(201).json(addedUsers);
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

module.exports.removeUsers = async (req, res, next) => {
  console.log("Req users body", req.body);
  const { users, userId } = req.body;
  const unitId = req.params.id;
  console.log("Req users body", req.body);

  const unit = await Unit.findById(unitId);
  if (!unit) throw(UnitNotFound);
  
  if (! await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) throw(ForbiddenAction);

  const removedUsers = [];

  for (const user of users) {
    const userUnit = await UnitUser.findOne({ unit: unitId, user: user.id });
    
    if (!userUnit) throw(UserNotInUnit);

    if (userUnit.role === "creator") {
      console.log(`Cannot remove the creator of the unit.`);
      continue; // Skip if the user is the creator
    }

    await UnitUser.findOneAndDelete({ unit: unitId, user: user.id });
    removedUsers.push(user);
  }

  res.status(200).json({ removed: removedUsers });
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

module.exports.updateUsers = async (req, res, next) => {
  const { add = [], remove = [] } = req.body;
  const unitId = req.params.id;

  const unit = await Unit.findById(unitId);
  if (!unit) throw UnitNotFound;

  // Ensure the user has permission to modify users in the unit
  if (!await userHasPermission(req.sessionUser.id, unitId, ["admin", "creator"])) {
    throw ForbiddenAction;
  }

  const addedUsers = [];
  const removedUsers = [];

  // Add users
  for (const user of add) {
    const existingUser = await UnitUser.findOne({ unit: unitId, user: user.id });
    if (existingUser) {
      console.log(`User ${user.id} already exists in the unit.`);
      continue; // Skip if the user is already in the unit
    }

    const newUnitUser = await UnitUser.create({
      user: user.id,
      unit: unitId,
      role: "member",
      joinedAt: Date.now(),
    });

    addedUsers.push(newUnitUser);
  }

  // Remove users (except the creator)
  for (const userId of remove) {
    const userUnit = await UnitUser.findOne({ unit: unitId, user: userId });

    if (!userUnit) {
      console.log(`User ${userId} is not in the unit.`);
      continue; // Skip if the user is not in the unit
    }

    if (userUnit.role === "creator") {
      console.log(`Cannot remove the creator of the unit.`);
      continue; // Skip if the user is the creator
    }

    await UnitUser.findOneAndDelete({ unit: unitId, user: userId });
    removedUsers.push(userId);
  }

  res.status(200).json({ added: addedUsers, removed: removedUsers });
};

// Function to check if a user has permission in a unit
const userHasPermission = async (userId, unitId, roles) => {
  const userUnit = await UnitUser.findOne({ unit: unitId, user: userId });
  return userUnit && roles.includes(userUnit.role);
};