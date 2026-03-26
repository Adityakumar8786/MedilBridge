const express = require("express");
const router = express.Router();
const { viewLabReports, addDiagnosis, getMyDiagnoses } = require("../controllers/doctorController");
const { protect } = require("../middleware/auth");
const roleGuard = require("../middleware/roleGuard");

router.use(protect, roleGuard("doctor"));

router.get("/reports", viewLabReports);
router.post("/diagnosis", addDiagnosis);
router.get("/diagnoses", getMyDiagnoses);

module.exports = router;