const db = require("../db");

const User = db.model("User", {
  username: { type: String, required: true /* optionally unique: true */ },
  password: { type: String, required: true },
  status: { type: String, default: "loggedout" }
});

module.exports = User;
