const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const routes = require("./routes");
const passport = require("passport");
const { FRONTEND_URL } = require("./util/constants");

require("./config/passport")(passport);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: FRONTEND_URL || "http://localhost:3000",
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use(passport.initialize());

// Routes init
app.use("/api", routes);
// Health check endpoint
app.get("/healthcheck", (req, res) => {
    res.status(200).send("OK");
});

module.exports = app;
