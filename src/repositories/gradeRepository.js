const prisma = require('../config/prisma');
const { GRADE_STATUS } = require('../utils/constants');

const findAll = async (skip, take, where = {}) => {
  return await prisma.grades.findMany({
    where,
    skip,
    take,
    orderBy: { grade_id: 'asc' }
  });
};

const findById = async (id) => {
  return await prisma.grades.findUnique({
    where: { grade_id: id }
  });
};

const findByTest = async (testId) => {
  return await prisma.grades.findMany({
    where: { test_id: testId },
    orderBy: { student_id: 'asc' }
  });
};

const findByStudent = async (studentId) => {
  return await prisma.grades.findMany({
    where: { student_id: studentId },
    include: { tests: true }
  });
};

const findByStudentAndTest = async (studentId, testId) => {
  return await prisma.grades.findFirst({
    where: { student_id: studentId, test_id: testId }
  });
};

const findByStudentAndClassDiscipline = async (studentId, classDisciplineId) => {
  return await prisma.grades.findMany({
    where: { 
      student_id: studentId,
      tests: { class_discipline_id: classDisciplineId }
    },
    include: { tests: true }
  });
};

const create = async (data) => {
  return await prisma.grades.create({ data });
};

const bulkCreate = async (gradesData) => {
  return await prisma.$transaction(
    gradesData.map((data) => prisma.grades.create({ data }))
  );
};

const update = async (id, data) => {
  return await prisma.grades.update({
    where: { grade_id: id },
    data
  });
};

const softDelete = async (id) => {
  return await prisma.grades.update({
    where: { grade_id: id },
    data: { grade_status: GRADE_STATUS.DELETED }
  });
};

const restore = async (id) => {
  return await prisma.grades.update({
    where: { grade_id: id },
    data: { grade_status: GRADE_STATUS.ACTIVE }
  });
};

const deleteByTest = async (testId) => {
  return await prisma.grades.deleteMany({
    where: { test_id: testId }
  });
};

const deleteByStudent = async (studentId) => {
  return await prisma.grades.deleteMany({
    where: { student_id: studentId }
  });
};

const count = async (where = {}) => {
  return await prisma.grades.count({ where });
};

module.exports = {
  findAll,
  findById,
  findByTest,
  findByStudent,
  findByStudentAndTest,
  findByStudentAndClassDiscipline,
  create,
  bulkCreate,
  update,
  softDelete,
  restore,
  deleteByTest,
  deleteByStudent,
  count
};