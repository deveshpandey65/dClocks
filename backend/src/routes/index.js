const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const managerRoutes = require("./managerRoutes");
const workerRoutes = require("./workerRoutes");

router.use("/auth", authRoutes);
router.use("/manager", managerRoutes);
router.use("/worker", workerRoutes);
router.get("/test", (req, res) => {
    res.json({ msg: "Auth route working!" });
});
module.exports = router; // ✅ Export router directly
