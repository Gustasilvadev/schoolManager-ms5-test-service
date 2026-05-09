const express = require('express');
const router = express.Router();
const finalAverageController = require('../controllers/finalAverageController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateFinalAverage,
  validateUpdateFinalAverage
} = require('../middlewares/validationMiddleware');

router.use(authMiddleware);

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

router.get('/listFinalAverages', ADMIN_OR_TEACHER, finalAverageController.getAllFinalAverages);
router.get('/listFinalAverageById/:id', ADMIN_OR_TEACHER, finalAverageController.getFinalAverageById);
router.get('/student/:studentId', ADMIN_OR_TEACHER, finalAverageController.getFinalAveragesByStudent);
router.get('/classDiscipline/:classDisciplineId', ADMIN_OR_TEACHER, finalAverageController.getFinalAveragesByClassDiscipline);
router.post('/createFinalAverage', ADMIN_OR_TEACHER, validateCreateFinalAverage, finalAverageController.createFinalAverage);
router.post('/calculate/:studentId/:classDisciplineId', ADMIN_OR_TEACHER, finalAverageController.calculateAndCreateFinalAverage);
router.put('/updateFinalAverageById/:id', ADMIN_OR_TEACHER, validateUpdateFinalAverage, finalAverageController.updateFinalAverage);
router.delete('/deleteFinalAverageById/:id', ADMIN_OR_TEACHER, finalAverageController.deleteFinalAverage);

module.exports = router;
