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
router.use(roleMiddleware(['ADMIN', 'TEACHER']));

router.get('/listFinalAverages', finalAverageController.getAllFinalAverages);
router.get('/listFinalAverageById/:id', finalAverageController.getFinalAverageById);
router.get('/student/:studentId', finalAverageController.getFinalAveragesByStudent);
router.get('/classDiscipline/:classDisciplineId', finalAverageController.getFinalAveragesByClassDiscipline);
router.post('/createFinalAverage', validateCreateFinalAverage, finalAverageController.createFinalAverage);
router.post('/calculate/:studentId/:classDisciplineId', finalAverageController.calculateAndCreateFinalAverage);
router.put('/updateFinalAverageById/:id', validateUpdateFinalAverage, finalAverageController.updateFinalAverage);
router.delete('/deleteFinalAverageById/:id', finalAverageController.deleteFinalAverage);

module.exports = router;