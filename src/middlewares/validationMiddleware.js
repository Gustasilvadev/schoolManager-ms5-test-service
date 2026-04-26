const { body, param, validationResult } = require('express-validator');
const { HTTP_STATUS } = require('../utils/constants');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};

// Aceita número ou string (com vírgula ou ponto) e valida intervalo [0, 10]
const isGradeValue = (value) => {
  const num = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : parseFloat(value);
  if (isNaN(num)) throw new Error('Nota deve ser um número');
  if (num < 0 || num > 10) throw new Error('Nota deve estar entre 0 e 10');
  return true;
};

// ---------- Testes (avaliações) ----------
const validateCreateTest = [
  body('test_type')
    .notEmpty().withMessage('Tipo de avaliação é obrigatório')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),
  body('test_description')
    .notEmpty().withMessage('Descrição da avaliação é obrigatória')
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),
  body('class_discipline_id')
    .isInt({ min: 1 }).withMessage('ID da disciplina na turma é obrigatório'),
  body('test_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

const validateUpdateTest = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('test_type')
    .optional()
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),
  body('test_description')
    .optional()
    .isLength({ max: 45 }).withMessage('Máximo 45 caracteres'),
  body('class_discipline_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID da disciplina na turma inválido'),
  body('test_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

// ---------- Notas (grades) ----------
const validateCreateGrade = [
  body('grade_value')
    .custom(isGradeValue),
  body('test_id')
    .isInt({ min: 1 }).withMessage('ID da avaliação é obrigatório'),
  body('student_id')
    .isInt({ min: 1 }).withMessage('ID do aluno é obrigatório'),
  body('grade_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

const validateUpdateGrade = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('grade_value')
    .optional()
    .custom(isGradeValue),
  body('test_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID da avaliação inválido'),
  body('student_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID do aluno inválido'),
  body('grade_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

const validateBulkGrades = [
  body('grades')
    .isArray({ min: 1 }).withMessage('Deve ser um array de notas'),
  body('grades.*.grade_value')
    .custom(isGradeValue),
  body('grades.*.test_id')
    .isInt({ min: 1 }).withMessage('ID da avaliação é obrigatório'),
  body('grades.*.student_id')
    .isInt({ min: 1 }).withMessage('ID do aluno é obrigatório'),
  validate
];

// ---------- Médias finais ----------
const validateCreateFinalAverage = [
  body('final_average_value')
    .isFloat({ min: 0, max: 10 }).withMessage('Média deve estar entre 0 e 10'),
  body('student_id')
    .isInt({ min: 1 }).withMessage('ID do aluno é obrigatório'),
  body('class_discipline_id')
    .isInt({ min: 1 }).withMessage('ID da disciplina na turma é obrigatório'),
  body('final_average_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

const validateUpdateFinalAverage = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('final_average_value')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('Média deve estar entre 0 e 10'),
  body('student_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID do aluno inválido'),
  body('class_discipline_id')
    .optional()
    .isInt({ min: 1 }).withMessage('ID da disciplina na turma inválido'),
  body('final_average_status')
    .optional()
    .isInt({ min: 0, max: 2 }).withMessage('Status deve ser 0, 1 ou 2'),
  validate
];

module.exports = {
  validateCreateTest,
  validateUpdateTest,
  validateCreateGrade,
  validateUpdateGrade,
  validateBulkGrades,
  validateCreateFinalAverage,
  validateUpdateFinalAverage
};