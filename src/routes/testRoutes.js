const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateTest,
  validateUpdateTest
} = require('../middlewares/validationMiddleware');

// Todas as rotas exigem autenticação
router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN', 'TEACHER']));

// Rotas de avaliações (testes)
router.get('/listTests', testController.getAllTests);
router.get('/listTestById/:id', testController.getTestById);
router.get('/class-discipline/:classDisciplineId', testController.getTestsByClassDiscipline);
router.post('/createTest', validateCreateTest, testController.createTest);
router.put('/updateTestById/:id', validateUpdateTest, testController.updateTest);
router.delete('/deleteTestById/:id', testController.deleteTest);

module.exports = router;