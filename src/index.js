const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const routes = require("./routes");

require("./config/passport")(passport);

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  }),
);
app.use(express.json({ limit: "10mb" })); // merge patch from dev/prpjzz
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(passport.initialize());

// Routes init
app.use("/api", routes);

app.get("/healthcheck", (req, res) => {
  res.status(200).send("OK");
});

module.exports = app;
// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
