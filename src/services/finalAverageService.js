const finalAverageRepo = require('../repositories/finalAverageRepository');
const gradeRepo = require('../repositories/gradeRepository');
const { findClassDisciplineById } = require('../utils/classesClient');
const { FINAL_AVERAGE_STATUS, MESSAGES } = require('../utils/constants');

const createFinalAverage = async (data) => {
  const existing = await finalAverageRepo.findByStudentAndClassDiscipline(
    data.student_id,
    data.class_discipline_id
  );
  if (existing) throw new Error(MESSAGES.FINAL_AVERAGE_ALREADY_EXISTS);

  const newFinalAverage = await finalAverageRepo.create(data);
  return newFinalAverage;
};

const calculateAndCreateFinalAverage = async (studentId, classDisciplineId) => {
  const grades = await gradeRepo.findByStudentAndClassDiscipline(studentId, classDisciplineId);
  
  if (grades.length === 0) {
    throw new Error('Não há notas lançadas para calcular a média');
  }

  const sum = grades.reduce((acc, grade) => acc + grade.grade_value, 0);
  const average = sum / grades.length;

  const roundedAverage = Math.round(average * 100) / 100;

  const existing = await finalAverageRepo.findByStudentAndClassDiscipline(studentId, classDisciplineId);
  
  if (existing) {
    return await finalAverageRepo.update(existing.final_average_id, {
      final_average_value: roundedAverage,
      final_average_status: FINAL_AVERAGE_STATUS.ACTIVE
    });
  } else {
    return await finalAverageRepo.create({
      final_average_value: roundedAverage,
      student_id: studentId,
      class_discipline_id: classDisciplineId,
      final_average_status: FINAL_AVERAGE_STATUS.ACTIVE
    });
  }
};

const getAllFinalAverages = async (filters = {}, page = 1, limit = 10, authToken = null) => {
  if (filters.class_discipline_id) {
    const cd = await findClassDisciplineById(filters.class_discipline_id, authToken);
    if (!cd) throw new Error(MESSAGES.CLASS_DISCIPLINE_NOT_FOUND);
  }

  const skip = (page - 1) * limit;
  const where = {};
  if (filters.student_id) where.student_id = filters.student_id;
  if (filters.class_discipline_id) where.class_discipline_id = filters.class_discipline_id;
  if (filters.final_average_status !== undefined) where.final_average_status = filters.final_average_status;

  const averages = await finalAverageRepo.findAll(skip, limit, where);
  const total = await finalAverageRepo.count(where);
  return { averages, total, page, limit };
};

const getFinalAverageById = async (id) => {
  const average = await finalAverageRepo.findById(id);
  if (!average) throw new Error(MESSAGES.FINAL_AVERAGE_NOT_FOUND);
  return average;
};

const getFinalAveragesByStudent = async (studentId) => {
  const averages = await finalAverageRepo.findByStudent(studentId);
  return averages;
};

const getFinalAveragesByClassDiscipline = async (classDisciplineId, authToken) => {
  const cd = await findClassDisciplineById(classDisciplineId, authToken);
  if (!cd) throw new Error(MESSAGES.CLASS_DISCIPLINE_NOT_FOUND);
  const averages = await finalAverageRepo.findByClassDiscipline(classDisciplineId);
  return averages;
};

const updateFinalAverage = async (id, updateData) => {
  const existing = await finalAverageRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.FINAL_AVERAGE_NOT_FOUND);
  const updated = await finalAverageRepo.update(id, updateData);
  return updated;
};

const deleteFinalAverage = async (id) => {
  const existing = await finalAverageRepo.findById(id);
  if (!existing) throw new Error(MESSAGES.FINAL_AVERAGE_NOT_FOUND);
  await finalAverageRepo.softDelete(id);
  return true;
};

module.exports = {
  createFinalAverage,
  calculateAndCreateFinalAverage,
  getAllFinalAverages,
  getFinalAverageById,
  getFinalAveragesByStudent,
  getFinalAveragesByClassDiscipline,
  updateFinalAverage,
  deleteFinalAverage
};