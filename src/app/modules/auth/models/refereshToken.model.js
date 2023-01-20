const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user_id: { type: String},
    token: { type: String},
    isActive: {type: Boolean},
    iat: { type: Number}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("RefereshToken", schema);
