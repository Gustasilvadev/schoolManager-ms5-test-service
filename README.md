# 🏫 SchoolManager: MS5 - TestService

## 1. Visão Geral do Projeto
O SchoolManager é um sistema de gestão escolar desenvolvido para digitalizar e acelerar processos administrativos e acadêmicos de escolas. O foco está na produtividade da secretaria e dos professores.

O sistema possui uma arquitetura baseada em **microsserviços**, utilizando um API Gateway como ponto de entrada (validando tokens gerados por este serviço) e comunicação híbrida (HTTP/REST para requisições síncronas e RabbitMQ para operações assíncronas). O ecossistema completo conta com 6 microsserviços isolados com seus próprios bancos de dados (MariaDB).

---

## 2. Sobre o TestService (MS5)
Este repositório contém exclusivamente o código do **MS5 - TestService**. Ele é responsável pela gestão das avaliações, notas e médias finais dos alunos dentro do sistema.

**Domínio:** Avaliações, notas e médias finais.

### Responsabilidades Principais
* **Gestão de Avaliações:** Criação, atualização e controle das avaliações (provas, trabalhos, etc.) vinculadas à relação turma-disciplina.
* **Gestão de Notas:** Cadastro individual e em lote das notas dos alunos em cada avaliação.
* **Cálculo de Médias Finais:** Geração e manutenção das médias finais dos alunos por disciplina da turma.
* **Consultas Acadêmicas:** Consulta de notas por aluno, por avaliação e de médias por turma-disciplina.

### Banco de Dados
Este microsserviço possui seu domínio de dados totalmente isolado, utilizando uma instância de **MariaDB** dedicada às tabelas `tests`, `grades` e `final_average`.

---

## 3. Padrão de Commits

Para mantermos o histórico limpo e rastreável, este projeto utiliza a especificação conforme os exemplos abaixo.

**Formato:** `<tipo>: <mensagem curta>`

**Tipos permitidos:**
- `feat`: Nova funcionalidade (ex: criação de nova rota de login).
- `fix`: Correção de bug (ex: ajuste na expiração do token).
- `chore`: Configurações, dependências e estrutura (ex: setup do banco MariaDB).
- `docs`: Atualização de documentação (ex: melhorias neste README).
- `refactor`: Refatoração de código sem alterar regra de negócio.
- `style`: Formatação de código (linting, prettier).
- `test`: Criação/alteração de testes de segurança ou unitários.

---

# 📡 Endpoints da API

## 📝 Tests (Avaliações)

| Método | Endpoint                                          | Descrição                                             | Auth | Body |
|--------|---------------------------------------------------|-------------------------------------------------------|------|------|
| GET    | `/tests/listTests`                                | Lista avaliações. ADMIN: ACTIVE+INACTIVE (use `?includeDeleted=true`/`?test_status=N`). TEACHER: força ACTIVE. | ✅   | — |
| GET    | `/tests/listTestById/{id}`                        | Busca avaliação por ID                                | ✅   | — |
| GET    | `/tests/classDiscipline/{classDisciplineId}`      | Lista avaliações por turma-disciplina                 | ✅   | — |
| POST   | `/tests/createTest`                               | Cria nova avaliação                                   | ✅   | dados da avaliação |
| PUT    | `/tests/updateTestById/{id}`                      | Atualiza avaliação (bloqueado se status=DELETED)      | ✅   | dados da avaliação |
| DELETE | `/tests/deleteTestById/{id}`                      | Deleta avaliação (soft, status=2)                     | ✅   | — |
| POST   | `/tests/restoreTestById/{id}`                     | Restaura avaliação deletada (status: 2 → 1)           | ✅   | — |

> **`getTestsByClassDiscipline` valida o `class_discipline_id` no MS4** via Token Propagation — retorna `404 CLASS_DISCIPLINE_NOT_FOUND` se a turma-disciplina não existir.

---

## 🧮 Grades (Notas)

| Método | Endpoint                               | Descrição                                  | Auth | Body |
|--------|----------------------------------------|--------------------------------------------|------|------|
| GET    | `/grades/listGrades`                   | Lista notas. ADMIN: ACTIVE+INACTIVE (use `?includeDeleted=true`/`?grade_status=N`). TEACHER: força ACTIVE. | ✅   | — |
| GET    | `/grades/listGradeById/{id}`           | Busca nota por ID                          | ✅   | — |
| GET    | `/grades/test/{testId}`                | Lista notas de uma avaliação               | ✅   | — |
| GET    | `/grades/student/{studentId}`          | Lista notas de um aluno                    | ✅   | — |
| POST   | `/grades/createGrade`                  | Cria nova nota                             | ✅   | dados da nota |
| POST   | `/grades/bulkCreateGrades`             | Cria notas em lote                         | ✅   | lista de notas |
| PUT    | `/grades/updateGradeById/{id}`         | Atualiza nota (bloqueado se status=DELETED) | ✅   | dados da nota |
| DELETE | `/grades/deleteGradeById/{id}`         | Deleta nota (soft, status=2)               | ✅   | — |
| POST   | `/grades/restoreGradeById/{id}`        | Restaura nota deletada (status: 2 → 1)     | ✅   | — |

> **`getGradesByStudent` valida o `student_id` no MS2** via Token Propagation — retorna `404 STUDENT_NOT_FOUND` se o aluno não existir.

---

## 📊 Final Averages (Médias Finais)

| Método | Endpoint                                                         | Descrição                                             | Auth | Body |
|--------|------------------------------------------------------------------|-------------------------------------------------------|------|------|
| GET    | `/finalAverages/listFinalAverages`                               | Lista médias. ADMIN: ACTIVE+INACTIVE (use `?includeDeleted=true`/`?final_average_status=N`). TEACHER: força ACTIVE. | ✅   | — |
| GET    | `/finalAverages/listFinalAverageById/{id}`                       | Busca média final por ID                              | ✅   | — |
| GET    | `/finalAverages/student/{studentId}`                             | Lista médias finais de um aluno                       | ✅   | — |
| GET    | `/finalAverages/classDiscipline/{classDisciplineId}`             | Lista médias finais por turma-disciplina              | ✅   | — |
| POST   | `/finalAverages/createFinalAverage`                              | Cria média final manualmente                          | ✅   | dados da média |
| POST   | `/finalAverages/calculate/{studentId}/{classDisciplineId}`       | Calcula e cria média final automaticamente            | ✅   | — |
| PUT    | `/finalAverages/updateFinalAverageById/{id}`                     | Atualiza média final (bloqueado se status=DELETED)    | ✅   | dados da média |
| DELETE | `/finalAverages/deleteFinalAverageById/{id}`                     | Deleta média final (soft, status=2)                   | ✅   | — |
| POST   | `/finalAverages/restoreFinalAverageById/{id}`                    | Restaura média deletada (status: 2 → 1)               | ✅   | — |
---

## 🔗 Integrações HTTP

O MS5 consome endpoints de outros microsserviços com **Token Propagation** (envia o `Authorization` recebido na requisição original):

| Cliente                     | Destino | Endpoint                                                     | Usado em                                                |
|-----------------------------|---------|--------------------------------------------------------------|---------------------------------------------------------|
| `utils/classesClient.js`    | MS4     | `GET /classes/checkTeacherAccess/{teacherId}/{classDisciplineId}` | Validação de acesso do professor à class_discipline |
| `utils/classesClient.js`    | MS4     | `GET /classes/listClassDisciplineById/{id}`                  | Validação de existência de class_discipline_id          |
| `utils/studentsClient.js`   | MS2     | `GET /students/listStudentById/{id}`                         | Validação de existência de student_id                   |

Variáveis de ambiente: `STUDENT_SERVICE_URL`, `CLASSES_SERVICE_URL`, `*_TIMEOUT_MS` (default 3000ms).

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                  | Auth |
|--------|-----------|---------------------------|------|
| GET    | `/health` | Verifica status da API     | ❌   |

---

## 🔐 Autenticação

- ✅ = Requer token JWT
- ❌ = Público
