const express = require("express");
const router = express.Router();
const { getTimeline } = require("../controllers/patientController");
const { protect } = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

router.use(protect, roleGuard("patient"));

router.get("/timeline", getTimeline);

module.exports = router;