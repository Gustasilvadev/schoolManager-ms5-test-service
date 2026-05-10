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

const ADMIN_ONLY = roleMiddleware(['ADMIN']);
const ADMIN_OR_TEACHER = roleMiddleware(['ADMIN', 'TEACHER']);

router.get('/listGrades', ADMIN_OR_TEACHER, gradeController.getAllGrades);
router.get('/listGradeById/:id', ADMIN_OR_TEACHER, gradeController.getGradeById);
router.get('/test/:testId', ADMIN_OR_TEACHER, gradeController.getGradesByTest);
router.get('/student/:studentId', ADMIN_OR_TEACHER, gradeController.getGradesByStudent);
router.post('/createGrade', ADMIN_OR_TEACHER, validateCreateGrade, gradeController.createGrade);
router.post('/bulkCreateGrades', ADMIN_OR_TEACHER, validateBulkGrades, gradeController.bulkCreateGrades);
router.put('/updateGradeById/:id', ADMIN_OR_TEACHER, validateUpdateGrade, gradeController.updateGrade);
router.delete('/deleteGradeById/:id', ADMIN_OR_TEACHER, gradeController.deleteGrade);
router.post('/restoreGradeById/:id', ADMIN_OR_TEACHER, gradeController.restoreGrade);

module.exports = router;
