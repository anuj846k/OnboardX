const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/docusign/webhook', webhookController.handleDocusignWebhook);

module.exports = router;