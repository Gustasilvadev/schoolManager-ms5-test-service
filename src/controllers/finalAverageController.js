const finalAverageService = require('../services/finalAverageService');
const { HTTP_STATUS, MESSAGES } = require('../utils/constants');

const createFinalAverage = async (req, res, next) => {
  try {
    const newAverage = await finalAverageService.createFinalAverage(req.body);
    return res.status(HTTP_STATUS.CREATED).json(newAverage);
  } catch (error) {
    if (error.message === MESSAGES.FINAL_AVERAGE_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const calculateAndCreateFinalAverage = async (req, res, next) => {
  try {
    const { studentId, classDisciplineId } = req.params;
    const result = await finalAverageService.calculateAndCreateFinalAverage(
      parseInt(studentId),
      parseInt(classDisciplineId)
    );
    return res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    if (error.message === MESSAGES.NO_GRADES_FOR_AVERAGE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const getAllFinalAverages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, student_id, class_discipline_id, final_average_status, includeDeleted } = req.query;
    const filters = {};
    if (student_id) filters.student_id = parseInt(student_id);
    if (class_discipline_id) filters.class_discipline_id = parseInt(class_discipline_id);
    if (final_average_status !== undefined) filters.final_average_status = parseInt(final_average_status);
    if (includeDeleted === 'true') filters.includeDeleted = true;

    const result = await finalAverageService.getAllFinalAverages(filters, parseInt(page), parseInt(limit), req.headers.authorization, req.user.role);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE) {
      return res.status(503).json({ error: error.message });
    }
    next(error);
  }
};

const getFinalAverageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const average = await finalAverageService.getFinalAverageById(parseInt(id));
    return res.status(HTTP_STATUS.OK).json(average);
  } catch (error) {
    if (error.message === MESSAGES.FINAL_AVERAGE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

const getFinalAveragesByStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const averages = await finalAverageService.getFinalAveragesByStudent(parseInt(studentId));
    return res.status(HTTP_STATUS.OK).json(averages);
  } catch (error) {
    next(error);
  }
};

const getFinalAveragesByClassDiscipline = async (req, res, next) => {
  try {
    const { classDisciplineId } = req.params;
    const averages = await finalAverageService.getFinalAveragesByClassDiscipline(parseInt(classDisciplineId), req.headers.authorization);
    return res.status(HTTP_STATUS.OK).json(averages);
  } catch (error) {
    if (error.message === MESSAGES.CLASS_DISCIPLINE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.EXTERNAL_SERVICE_UNAVAILABLE) {
      return res.status(503).json({ error: error.message });
    }
    next(error);
  }
};

const updateFinalAverage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await finalAverageService.updateFinalAverage(parseInt(id), req.body);
    return res.status(HTTP_STATUS.OK).json(updated);
  } catch (error) {
    if (error.message === MESSAGES.FINAL_AVERAGE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.CANNOT_EDIT_DELETED_FINAL_AVERAGE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const restoreFinalAverage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restored = await finalAverageService.restoreFinalAverage(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({
      message: MESSAGES.FINAL_AVERAGE_RESTORED,
      finalAverage: restored
    });
  } catch (error) {
    if (error.message === MESSAGES.FINAL_AVERAGE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    if (error.message === MESSAGES.NOT_DELETED_CANNOT_RESTORE) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
    next(error);
  }
};

const deleteFinalAverage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await finalAverageService.deleteFinalAverage(parseInt(id));
    return res.status(HTTP_STATUS.OK).json({ message: 'Média final desativada com sucesso' });
  } catch (error) {
    if (error.message === MESSAGES.FINAL_AVERAGE_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: error.message });
    }
    next(error);
  }
};

module.exports = {
  createFinalAverage,
  calculateAndCreateFinalAverage,
  getAllFinalAverages,
  getFinalAverageById,
  getFinalAveragesByStudent,
  getFinalAveragesByClassDiscipline,
  updateFinalAverage,
  deleteFinalAverage,
  restoreFinalAverage
};