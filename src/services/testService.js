const testRepo = require('../repositories/testRepository');
const { checkTeacherAccess, findClassDisciplineById } = require('../utils/classesClient');
const { TEST_STATUS, MESSAGES, ROLES } = require('../utils/constants');

const ensureTeacherOwnsClassDiscipline = async (currentUser, classDisciplineId, authToken) => {
  if (!currentUser || currentUser.role !== ROLES.TEACHER) return;
  if (!currentUser.teacher_id) throw new Error(MESSAGES.FORBIDDEN);
  const allowed = await checkTeacherAccess(currentUser.teacher_id, classDisciplineId, authToken);
  if (!allowed) throw new Error(MESSAGES.FORBIDDEN);
};

const createTest = async (data, currentUser = null, authToken = null) => {
  await ensureTeacherOwnsClassDiscipline(currentUser, data.class_discipline_id, authToken);
  const newTest = await testRepo.create({
    ...data,
    test_status: data.test_status !== undefined ? data.test_status : TEST_STATUS.ACTIVE
  });
  return newTest;
};

const getAllTests = async (filters = {}, page = 1, limit = 10, userRole = ROLES.ADMIN) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.test_type) where.test_type = { contains: filters.test_type };
  if (filters.class_discipline_id) where.class_discipline_id = filters.class_discipline_id;

  if (userRole === ROLES.TEACHER) {
    where.test_status = TEST_STATUS.ACTIVE;
  } else if (filters.test_status !== undefined) {
    where.test_status = filters.test_status;
  } else if (filters.includeDeleted !== true) {
    where.test_status = { in: [TEST_STATUS.ACTIVE, TEST_STATUS.INACTIVE] };
  }

  const tests = await testRepo.findAll(skip, limit, where);
  const total = await testRepo.count(where);
  return { tests, total, page, limit };
};

const getTestById = async (id) => {
  const test = await testRepo.findById(id);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);
  return test;
};

const getTestsByClassDiscipline = async (classDisciplineId, authToken) => {
  const cd = await findClassDisciplineById(classDisciplineId, authToken);
  if (!cd) throw new Error(MESSAGES.CLASS_DISCIPLINE_NOT_FOUND);
  const tests = await testRepo.findByClassDiscipline(classDisciplineId);
  return tests;
};

const updateTest = async (id, updateData, currentUser = null, authToken = null) => {
  const existing = await testRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEST_NOT_FOUND);
  if (existing.test_status === TEST_STATUS.DELETED) {
    throw new Error(MESSAGES.CANNOT_EDIT_DELETED_TEST);
  }
  await ensureTeacherOwnsClassDiscipline(currentUser, existing.class_discipline_id, authToken);
  const updated = await testRepo.update(id, updateData);
  return updated;
};

const deleteTest = async (id, currentUser = null, authToken = null) => {
  const existing = await testRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEST_NOT_FOUND);
  await ensureTeacherOwnsClassDiscipline(currentUser, existing.class_discipline_id, authToken);
  await testRepo.softDelete(id);
  return true;
};

const restoreTest = async (id, currentUser = null, authToken = null) => {
  const existing = await testRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEST_NOT_FOUND);
  if (existing.test_status !== TEST_STATUS.DELETED) {
    throw new Error(MESSAGES.NOT_DELETED_CANNOT_RESTORE);
  }
  await ensureTeacherOwnsClassDiscipline(currentUser, existing.class_discipline_id, authToken);
  return await testRepo.restore(id);
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  getTestsByClassDiscipline,
  updateTest,
  deleteTest,
  restoreTest
};