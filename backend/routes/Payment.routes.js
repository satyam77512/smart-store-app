const express = require('express');
const router = express.Router();
const {payment} = require('../controllers/PaymentController');

router.post("/payment",payment);

module.exports = router;