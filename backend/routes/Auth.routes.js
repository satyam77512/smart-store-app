const express = require('express');
const { signup,login,userDetails} = require("../controllers/AuthControllers");

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post("/details",userDetails);

module.exports = router;
