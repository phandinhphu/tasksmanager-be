const mongoose = require("mongoose");

const LogEmailSchema = new mongoose.Schema({
  to: String,
  subject: String,
  text: String,
  sentAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["success", "fail"], default: "success" },
  error: String,
});

const LogEmail = mongoose.model("LogEmail", LogEmailSchema);

module.exports = { LogEmail };
