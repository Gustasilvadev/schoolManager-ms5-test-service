const gradeRepo = require('../repositories/gradeRepository');
const testRepo = require('../repositories/testRepository');
const { GRADE_STATUS, MESSAGES } = require('../utils/constants');

const createGrade = async (data) => {
  const test = await testRepo.findById(data.test_id);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);

  const existing = await gradeRepo.findByStudentAndTest(data.student_id, data.test_id);
  if (existing) throw new Error(MESSAGES.GRADE_ALREADY_EXISTS);

  const newGrade = await gradeRepo.create(data);
  return newGrade;
};

const bulkCreateGrades = async (gradesData) => {
  const testIds = [...new Set(gradesData.map(g => g.test_id))];
  for (const testId of testIds) {
    const test = await testRepo.findById(testId);
    if (!test) throw new Error(`Avaliação com ID ${testId} não encontrada`);
  }

  const result = await gradeRepo.bulkCreate(gradesData);
  return result;
};

const getAllGrades = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.test_id) where.test_id = filters.test_id;
  if (filters.student_id) where.student_id = filters.student_id;
  if (filters.grade_status !== undefined) where.grade_status = filters.grade_status;

  const grades = await gradeRepo.findAll(skip, limit, where);
  const total = await gradeRepo.count(where);
  return { grades, total, page, limit };
};

const getGradeById = async (id) => {
  const grade = await gradeRepo.findById(id);
  if (!grade) throw new Error(MESSAGES.GRADE_NOT_FOUND);
  return grade;
};

const getGradesByTest = async (testId) => {
  const test = await testRepo.findById(testId);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);
  const grades = await gradeRepo.findByTest(testId);
  return grades;
};

const getGradesByStudent = async (studentId) => {
  const grades = await gradeRepo.findByStudent(studentId);
  return grades;
};

const updateGrade = async (id, updateData) => {
  const existing = await gradeRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.GRADE_NOT_FOUND);
  const updated = await gradeRepo.update(id, updateData);
  return updated;
};

const deleteGrade = async (id) => {
  const existing = await gradeRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.GRADE_NOT_FOUND);
  await gradeRepo.softDelete(id);
  return true;
};

module.exports = {
  createGrade,
  bulkCreateGrades,
  getAllGrades,
  getGradeById,
  getGradesByTest,
  getGradesByStudent,
  updateGrade,
  deleteGrade
};