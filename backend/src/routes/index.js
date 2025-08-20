const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const jobRoutes = require("./jobRoutes");

router.use("/auth", authRoutes);
router.use("/job", jobRoutes);
router.get("/test", (req, res) => {
    res.json({ msg: "Auth route working!" });
});
module.exports = router; // ✅ Export router directly
