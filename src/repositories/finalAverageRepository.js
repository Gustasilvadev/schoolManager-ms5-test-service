const prisma = require('../config/prisma');
const { FINAL_AVERAGE_STATUS } = require('../utils/constants');

const findAll = async (skip, take, where = {}) => {
  return await prisma.final_average.findMany({
    where,
    skip,
    take,
    orderBy: { final_average_id: 'asc' }
  });
};

const findById = async (id) => {
  return await prisma.final_average.findUnique({
    where: { final_average_id: id }
  });
};

const findByStudent = async (studentId) => {
  return await prisma.final_average.findMany({
    where: { student_id: studentId },
    orderBy: { final_average_id: 'asc' }
  });
};

const findByClassDiscipline = async (classDisciplineId) => {
  return await prisma.final_average.findMany({
    where: { class_discipline_id: classDisciplineId },
    orderBy: { student_id: 'asc' }
  });
};

const findByStudentAndClassDiscipline = async (studentId, classDisciplineId) => {
  return await prisma.final_average.findFirst({
    where: { student_id: studentId, class_discipline_id: classDisciplineId }
  });
};

const create = async (data) => {
  return await prisma.final_average.create({ data });
};

const update = async (id, data) => {
  return await prisma.final_average.update({
    where: { final_average_id: id },
    data
  });
};

const softDelete = async (id) => {
  return await prisma.final_average.update({
    where: { final_average_id: id },
    data: { final_average_status: FINAL_AVERAGE_STATUS.DELETED }
  });
};

const deleteByStudent = async (studentId) => {
  return await prisma.final_average.deleteMany({
    where: { student_id: studentId }
  });
};

const deleteByClassDiscipline = async (classDisciplineId) => {
  return await prisma.final_average.deleteMany({
    where: { class_discipline_id: classDisciplineId }
  });
};

const count = async (where = {}) => {
  return await prisma.final_average.count({ where });
};

module.exports = {
  findAll,
  findById,
  findByStudent,
  findByClassDiscipline,
  findByStudentAndClassDiscipline,
  create,
  update,
  softDelete,
  deleteByStudent,
  deleteByClassDiscipline,
  count
};