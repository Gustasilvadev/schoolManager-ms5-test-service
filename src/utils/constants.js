module.exports = {
  TEST_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  GRADE_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  FINAL_AVERAGE_STATUS: {
    ACTIVE: 1,
    INACTIVE: 0,
    DELETED: 2
  },
  ROLES: {
    ADMIN: 'ADMIN',
    TEACHER: 'TEACHER'
  },
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
  },
  MESSAGES: {
    TOKEN_MISSING: 'Token não fornecido',
    TOKEN_INVALID: 'Token inválido ou expirado',
    FORBIDDEN: 'Acesso negado: permissão insuficiente',
    TEST_NOT_FOUND: 'Avaliação não encontrada',
    TEST_TYPE_REQUIRED: 'Tipo de avaliação é obrigatório',
    TEST_DESCRIPTION_REQUIRED: 'Descrição da avaliação é obrigatória',
    GRADE_NOT_FOUND: 'Nota não encontrada',
    STUDENT_NOT_FOUND: 'Aluno não encontrado',
    GRADE_ALREADY_EXISTS: 'Nota já lançada para este aluno nesta avaliação',
    GRADE_VALUE_INVALID: 'Valor da nota inválido (deve estar entre 0 e 10)',
    FINAL_AVERAGE_NOT_FOUND: 'Média final não encontrada',
    FINAL_AVERAGE_ALREADY_EXISTS: 'Média final já calculada para este aluno nesta disciplina',
    CLASS_DISCIPLINE_NOT_FOUND: 'Disciplina não encontrada na turma',
    INVALID_DATA: 'Dados inválidos',
    REQUIRED_FIELD: 'Campo obrigatório não preenchido'
  }
};