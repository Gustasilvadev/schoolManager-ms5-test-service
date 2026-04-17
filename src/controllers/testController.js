const testService = require('../services/testService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const createTest = async (req, res, next) => {
  try {
    const newTest = await testService.createTest(req.body);
    return res.status(HTTP_STATUS.CREATED).json(newTest);
  } catch (error) {
    next(error);
  }
};

const getAllTests = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, test_type, test_status, class_discipline_id } = req.query;
    const filters = {};
    if (test_type) filters.test_type = test_type;
    if (test_status !== undefined) filters.test_status = parseInt(test_status);
    if (class_discipline_id) filters.class_discipline_id = parseInt(class_discipline_id);

    const result = await testService.getAllTests(filters, parseInt(page), parseInt(limit));
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getTestById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const test = await testService.getTestById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(test);
  } catch (error) {
    if (error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getTestsByClassDiscipline = async (req, res, next) => {
  try {
    const { classDisciplineId } = req.params;
    const tests = await testService.getTestsByClassDiscipline(parseInt(classDisciplineId));
    return res.status(HTTP_STATUS.OK).json(tests);
  } catch (error) {
    next(error);
  }
};

const updateTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await testService.updateTest(parseInt(id), req.body);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const deleteTest = async (req, res, next) => {
  try {
    const { id } = req.params;
    await testService.deleteTest(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({ message: 'Avaliação desativada com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createTest,
  getAllTests,
  getTestById,
  getTestsByClassDiscipline,
  updateTest,
  deleteTest
};