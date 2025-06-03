const mongoose = require("mongoose");
const { Schema } = mongoose;

const statusSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    color: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Status", statusSchema);
