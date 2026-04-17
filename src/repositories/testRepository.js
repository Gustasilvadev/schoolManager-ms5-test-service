const prisma = require('../config/prisma');
const { TEST_STATUS } = require('../utils/constants');

const findAll = async (skip, take, where = {}) => {
  return await prisma.tests.findMany({
    where,
    skip,
    take,
    orderBy: { test_id: 'asc' }
  });
};

const findById = async (id) => {
  return await prisma.tests.findUnique({
    where: { test_id: id },
    include: { grades: true }
  });
};

const findByClassDiscipline = async (classDisciplineId) => {
  return await prisma.tests.findMany({
    where: { class_discipline_id: classDisciplineId },
    orderBy: { test_id: 'asc' }
  });
};

const create = async (data) => {
  return await prisma.tests.create({ data });
};

const update = async (id, data) => {
  return await prisma.tests.update({
    where: { test_id: id },
    data
  });
};

const softDelete = async (id) => {
  return await prisma.tests.update({
    where: { test_id: id },
    data: { test_status: TEST_STATUS.DELETED }
  });
};

const count = async (where = {}) => {
  return await prisma.tests.count({ where });
};

module.exports = {
  findAll,
  findById,
  findByClassDiscipline,
  create,
  update,
  softDelete,
  count
};