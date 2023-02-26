const Router = require('express')
const router = new Router();
const certificateController = require('../controllers/certificateController');

router.get('/downloadCertificate', certificateController.downloadCertificate);
router.get('/getAllCertificates', certificateController.getAllCertificates);
router.get('/getUserCertificates', certificateController.getUserCertificates)

module.exports = router;