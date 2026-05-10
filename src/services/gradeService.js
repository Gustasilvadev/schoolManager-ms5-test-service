const gradeRepo = require('../repositories/gradeRepository');
const testRepo = require('../repositories/testRepository');
const { checkTeacherAccess } = require('../utils/classesClient');
const { findStudentById } = require('../utils/studentsClient');
const { GRADE_STATUS, MESSAGES, ROLES } = require('../utils/constants');

const ensureTeacherOwnsTest = async (currentUser, test, authToken) => {
  if (!currentUser || currentUser.role !== ROLES.TEACHER) return;
  if (!currentUser.teacher_id) throw new Error(MESSAGES.FORBIDDEN);
  const allowed = await checkTeacherAccess(currentUser.teacher_id, test.class_discipline_id, authToken);
  if (!allowed) throw new Error(MESSAGES.FORBIDDEN);
};

const createGrade = async (data, currentUser = null, authToken = null) => {
  const test = await testRepo.findById(data.test_id);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);

  await ensureTeacherOwnsTest(currentUser, test, authToken);

  const existing = await gradeRepo.findByStudentAndTest(data.student_id, data.test_id);
  if (existing) throw new Error(MESSAGES.GRADE_ALREADY_EXISTS);
  let gradeValue = data.grade_value;
  if (typeof gradeValue === 'string') {
    gradeValue = parseFloat(gradeValue.replace(',', '.'));
  }
  try {
    const newGrade = await gradeRepo.create({
      grade_value: gradeValue,
      test_id: data.test_id,
      student_id: data.student_id,
      grade_status: data.grade_status !== undefined ? data.grade_status : 1
    });
    return newGrade;
  } catch (err) {
    if (err?.code === 'P2002') {
      throw new Error(MESSAGES.GRADE_ALREADY_EXISTS);
    }
    throw err;
  }
};

const bulkCreateGrades = async (gradesData, currentUser = null, authToken = null) => {
  const testIds = [...new Set(gradesData.map(g => g.test_id))];
  const tests = [];
  for (const testId of testIds) {
    const test = await testRepo.findById(testId);
    if (!test) throw new Error(`Avaliação com ID ${testId} não encontrada`);
    tests.push(test);
  }

  for (const test of tests) {
    await ensureTeacherOwnsTest(currentUser, test, authToken);
  }

  const enrichedData = gradesData.map(grade => {
    let gradeValue = grade.grade_value;
    if (typeof gradeValue === 'string') {
      gradeValue = parseFloat(gradeValue.replace(',', '.'));
    }
    return {
      grade_value: gradeValue,
      test_id: grade.test_id,
      student_id: grade.student_id,
      grade_status: grade.grade_status !== undefined ? grade.grade_status : 1
    };
  });

  try {
    const result = await gradeRepo.bulkCreate(enrichedData);
    return result;
  } catch (err) {
    if (err?.code === 'P2002') {
      throw new Error(MESSAGES.GRADE_ALREADY_EXISTS);
    }
    throw err;
  }
};

const getAllGrades = async (filters = {}, page = 1, limit = 10, userRole = ROLES.ADMIN) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.test_id) where.test_id = filters.test_id;
  if (filters.student_id) where.student_id = filters.student_id;

  if (userRole === ROLES.TEACHER) {
    where.grade_status = GRADE_STATUS.ACTIVE;
  } else if (filters.grade_status !== undefined) {
    where.grade_status = filters.grade_status;
  } else if (filters.includeDeleted !== true) {
    where.grade_status = { in: [GRADE_STATUS.ACTIVE, GRADE_STATUS.INACTIVE] };
  }

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

const getGradesByStudent = async (studentId, authToken) => {
  const student = await findStudentById(studentId, authToken);
  if (!student) throw new Error(MESSAGES.STUDENT_NOT_FOUND);
  const grades = await gradeRepo.findByStudent(studentId);
  return grades;
};

const updateGrade = async (id, updateData, currentUser = null, authToken = null) => {
  const existing = await gradeRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.GRADE_NOT_FOUND);
  if (existing.grade_status === GRADE_STATUS.DELETED) {
    throw new Error(MESSAGES.CANNOT_EDIT_DELETED_GRADE);
  }

  const test = await testRepo.findById(existing.test_id);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);
  await ensureTeacherOwnsTest(currentUser, test, authToken);

  if (updateData.grade_value !== undefined) {
    let gradeValue = updateData.grade_value;
    if (typeof gradeValue === 'string') {
      gradeValue = parseFloat(gradeValue.replace(',', '.'));
    }
    updateData.grade_value = gradeValue;
  }

  const updated = await gradeRepo.update(id, updateData);
  return updated;
};

const deleteGrade = async (id, currentUser = null, authToken = null) => {
  const existing = await gradeRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.GRADE_NOT_FOUND);

  const test = await testRepo.findById(existing.test_id);
  if (test) await ensureTeacherOwnsTest(currentUser, test, authToken);

  await gradeRepo.softDelete(id);
  return true;
};

const restoreGrade = async (id, currentUser = null, authToken = null) => {
  const existing = await gradeRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.GRADE_NOT_FOUND);
  if (existing.grade_status !== GRADE_STATUS.DELETED) {
    throw new Error(MESSAGES.NOT_DELETED_CANNOT_RESTORE);
  }
  const test = await testRepo.findById(existing.test_id);
  if (test) await ensureTeacherOwnsTest(currentUser, test, authToken);
  return await gradeRepo.restore(id);
};

module.exports = {
  createGrade,
  bulkCreateGrades,
  getAllGrades,
  getGradeById,
  getGradesByTest,
  getGradesByStudent,
  updateGrade,
  deleteGrade,
  restoreGrade
};