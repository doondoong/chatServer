const crypto = require("crypto");

function generateSalt(bytes = 16) {
  return crypto.randomBytes(bytes).toString("hex");
}

function sha256HashPassword(password, salt, pepper = "") {
  // sha256(password + salt + pepper)
  return crypto
    .createHash("sha256")
    .update(`${password}${salt}${pepper}`, "utf8")
    .digest("hex");
}

module.exports = { generateSalt, sha256HashPassword };
