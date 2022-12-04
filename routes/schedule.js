const express = require("express");
const { getMeetSlots } = require("../controllers/meet");
const { createSchedule, getActiveSchedule } = require("../controllers/schedule");
const router = express.Router();

router.post("/schedule/create", createSchedule);
router.post("/schedule/meet/slots", getMeetSlots)
router.get("/schedule", getActiveSchedule)

module.exports = router; 