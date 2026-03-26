const express = require("express");
const router = express.Router();
const { getAggregatedStats } = require("../controllers/govController");
const { protect } = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

router.use(protect, roleGuard("government"));

router.get("/stats", getAggregatedStats);

module.exports = router;