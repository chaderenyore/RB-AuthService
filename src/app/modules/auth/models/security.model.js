const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user_id: { type: String},
    user_type: { type: String, enum: ["user", "minder", "admin"] },
    token: {type: String},
    login_location: {type: String},
    device_imei: {type: String},
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("SecurityLog", schema);
