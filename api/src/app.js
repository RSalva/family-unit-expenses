const config = require("./lib/config");
const express = require("express");
const logger = require("morgan");
require("./lib/db");

const app = express();

app.set('trust proxy', 1);

// Middlewares
app.use(logger("dev"));
app.use(express.json());

// Load API routes
app.use("/api/v1", require("./api"));
// Load React APP
app.use(require("./web"));

if (process.env.NODE_ENV !== "test") {
  app.listen(config.get("port"), () =>
    console.info(`Application running at port ${config.get("port")}`)
  );
}

module.exports = app;
