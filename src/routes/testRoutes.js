const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateTest,
  validateUpdateTest
} = require('../middlewares/validationMiddleware');

router.use(authMiddleware);

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

router.get('/listTests', ADMIN_OR_TEACHER, testController.getAllTests);
router.get('/listTestById/:id', ADMIN_OR_TEACHER, testController.getTestById);
router.get('/classDiscipline/:classDisciplineId', ADMIN_OR_TEACHER, testController.getTestsByClassDiscipline);
router.post('/createTest', ADMIN_OR_TEACHER, validateCreateTest, testController.createTest);
router.put('/updateTestById/:id', ADMIN_OR_TEACHER, validateUpdateTest, testController.updateTest);
router.delete('/deleteTestById/:id', ADMIN_OR_TEACHER, testController.deleteTest);
router.post('/restoreTestById/:id', ADMIN_OR_TEACHER, testController.restoreTest);

module.exports = router;
