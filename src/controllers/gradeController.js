const gradeService = require('../services/gradeService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const createGrade = async (req, res, next) => {
  try {
    const newGrade = await gradeService.createGrade(req.body, req.user);
    return res.status(HTTP_STATUS.CREATED).json(newGrade);
  } catch (error) {
    if (error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.GRADE_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    if (error.message === MESSAGES.FORBIDDEN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: error.message });
    }
    next(error);
  }
};

const bulkCreateGrades = async (req, res, next) => {
  try {
    const { grades } = req.body;
    const result = await gradeService.bulkCreateGrades(grades, req.user);
    const count = Array.isArray(result) ? result.length : (result?.count ?? 0);
    return res.status(HTTP_STATUS.CREATED).json({
      message: `${count} notas lançadas com sucesso`,
      count
    });
  } catch (error) {
    if (error.message.includes('não encontrada')) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.FORBIDDEN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: error.message });
    }
    next(error);
  }
};

const getAllGrades = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, test_id, student_id, grade_status } = req.query;
    const filters = {};
    if (test_id) filters.test_id = parseInt(test_id);
    if (student_id) filters.student_id = parseInt(student_id);
    if (grade_status !== undefined) filters.grade_status = parseInt(grade_status);

    const result = await gradeService.getAllGrades(filters, parseInt(page), parseInt(limit));
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const getGradeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const grade = await gradeService.getGradeById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(grade);
  } catch (error) {
    if (error.message === MESSAGES.GRADE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getGradesByTest = async (req, res, next) => {
  try {
    const { testId } = req.params;
    const grades = await gradeService.getGradesByTest(parseInt(testId));
    return res.status(HTTP_STATUS.OK).json(grades);
  } catch (error) {
    if (error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getGradesByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const grades = await gradeService.getGradesByStudent(parseInt(studentId));
    return res.status(HTTP_STATUS.OK).json(grades);
  } catch (error) {
    next(error);
  }
};

const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await gradeService.updateGrade(parseInt(id), req.body, req.user);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.GRADE_NOT_FOUND || error.message === MESSAGES.TEST_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.FORBIDDEN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: error.message });
    }
    next(error);
  }
};

const deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    await gradeService.deleteGrade(parseInt(id), req.user);
    return res.status(HTTP_STATUS.OK).json({ message: 'Nota desativada com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.GRADE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.FORBIDDEN) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ error: error.message });
    }
    next(error);
  }
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