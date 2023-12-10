const controller = require('../controllers/producers');
const router = require('express').Router();


router.get('/', controller.staticsDashboard);

module.exports = router;