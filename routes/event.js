const express = require("express");
const { createMeet } = require("../controllers/meet");
const router = express.Router();

router.post("/meet/create", createMeet);

module.exports = router;
