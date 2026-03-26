const express = require("express");
const router = express.Router();
const { submitReport, getMyReports } = require("../controllers/labController");
const { protect } = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

router.use(protect, roleGuard("lab"));

router.post("/report", submitReport);
router.get("/reports", getMyReports);

module.exports = router;