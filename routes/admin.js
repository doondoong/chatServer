const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { generateSalt, sha256HashPassword } = require("../utils/password");

router.post("/users", async (req, res) => {
  try {
    const { userName, password, role } = req.body;

    if (!userName?.trim() || !password?.trim()) {
      return res
        .status(400)
        .json({ ok: false, error: "userName/password required" });
    }

    const exists = await User.findOne({ userName: userName.trim() });
    if (exists) {
      return res
        .status(409)
        .json({ ok: false, error: "userName already exists" });
    }

    const salt = generateSalt(16);
    const pepper = process.env.PASSWORD_PEPPER || "";
    const passwordHash = sha256HashPassword(password, salt, pepper);

    const user = await User.create({
      userName: userName.trim(),
      passwordHash,
      passwordSalt: salt,
      role: role?.trim() || "user",
    });

    return res.json({
      ok: true,
      data: {
        id: user._id,
        userName: user.userName,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
