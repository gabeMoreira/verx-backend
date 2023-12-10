const controller = require('../controllers/producers');
const router = require('express').Router();

router.get('/', controller.findAllProducers);
router.get('/:id', controller.findProducerById);
router.post('/', controller.createProducer);
router.put('/:id', controller.updateProducer);
router.delete('/:id', controller.deleteProducer);

module.exports = router;
