const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateCreateGrade,
  validateUpdateGrade,
  validateBulkGrades
} = require('../middlewares/validationMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware(['ADMIN', 'TEACHER']));

router.get('/listGrades', gradeController.getAllGrades);
router.get('/listGradeById/:id', gradeController.getGradeById);
router.get('/test/:testId', gradeController.getGradesByTest);
router.get('/student/:studentId', gradeController.getGradesByStudent);
router.post('/createGrade', validateCreateGrade, gradeController.createGrade);
router.post('/bulkCreateGrades', validateBulkGrades, gradeController.bulkCreateGrades);
router.put('/updateGradeById/:id', validateUpdateGrade, gradeController.updateGrade);
router.delete('/deleteGradeById/:id', gradeController.deleteGrade);

module.exports = router;