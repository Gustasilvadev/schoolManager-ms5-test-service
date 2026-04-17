const testRepo = require('../repositories/testRepository');
const { TEST_STATUS, MESSAGES } = require('../utils/constants');

const createTest = async (data) => {
  const newTest = await testRepo.create(data);
  return newTest;
};

const getAllTests = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = {};
  if (filters.test_type) where.test_type = { contains: filters.test_type };
  if (filters.test_status !== undefined) where.test_status = filters.test_status;
  if (filters.class_discipline_id) where.class_discipline_id = filters.class_discipline_id;

  const tests = await testRepo.findAll(skip, limit, where);
  const total = await testRepo.count(where);
  return { tests, total, page, limit };
};

const getTestById = async (id) => {
  const test = await testRepo.findById(id);
  if (!test) throw new Error(MESSAGES.TEST_NOT_FOUND);
  return test;
};

const getTestsByClassDiscipline = async (classDisciplineId) => {
  const tests = await testRepo.findByClassDiscipline(classDisciplineId);
  return tests;
};

const updateTest = async (id, updateData) => {
  const existing = await testRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEST_NOT_FOUND);
  const updated = await testRepo.update(id, updateData);
  return updated;
};

const deleteTest = async (id) => {
  const existing = await testRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.TEST_NOT_FOUND);
  await testRepo.softDelete(id);
  return true;
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  getTestsByClassDiscipline,
  updateTest,
  deleteTest
};