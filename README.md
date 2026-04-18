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
| GET    | `/tests/listTests`                                | Lista todas as avaliações                             | ✅   | — |
| GET    | `/tests/listTestById/{id}`                        | Busca avaliação por ID                                | ✅   | — |
| GET    | `/tests/class-discipline/{classDisciplineId}`     | Lista avaliações por turma-disciplina                 | ✅   | — |
| POST   | `/tests/createTest`                               | Cria nova avaliação                                   | ✅   | dados da avaliação |
| PUT    | `/tests/updateTestById/{id}`                      | Atualiza dados da avaliação                           | ✅   | dados da avaliação |
| DELETE | `/tests/deleteTestById/{id}`                      | Deleta avaliação (lógico)                             | ✅   | — |

---

## 🧮 Grades (Notas)

| Método | Endpoint                               | Descrição                                  | Auth | Body |
|--------|----------------------------------------|--------------------------------------------|------|------|
| GET    | `/grades/listGrades`                   | Lista todas as notas                       | ✅   | — |
| GET    | `/grades/listGradeById/{id}`           | Busca nota por ID                          | ✅   | — |
| GET    | `/grades/test/{testId}`                | Lista notas de uma avaliação               | ✅   | — |
| GET    | `/grades/student/{studentId}`          | Lista notas de um aluno                    | ✅   | — |
| POST   | `/grades/createGrade`                  | Cria nova nota                             | ✅   | dados da nota |
| POST   | `/grades/bulkCreateGrades`             | Cria notas em lote                         | ✅   | lista de notas |
| PUT    | `/grades/updateGradeById/{id}`         | Atualiza nota                              | ✅   | dados da nota |
| DELETE | `/grades/deleteGradeById/{id}`         | Deleta nota (lógico)                       | ✅   | — |

---

## 📊 Final Averages (Médias Finais)

| Método | Endpoint                                                         | Descrição                                             | Auth | Body |
|--------|------------------------------------------------------------------|-------------------------------------------------------|------|------|
| GET    | `/finalAverages/listFinalAverages`                               | Lista todas as médias finais                          | ✅   | — |
| GET    | `/finalAverages/listFinalAverageById/{id}`                       | Busca média final por ID                              | ✅   | — |
| GET    | `/finalAverages/student/{studentId}`                             | Lista médias finais de um aluno                       | ✅   | — |
| GET    | `/finalAverages/classDiscipline/{classDisciplineId}`             | Lista médias finais por turma-disciplina              | ✅   | — |
| POST   | `/finalAverages/createFinalAverage`                              | Cria média final manualmente                          | ✅   | dados da média |
| POST   | `/finalAverages/calculate/{studentId}/{classDisciplineId}`       | Calcula e cria média final automaticamente            | ✅   | — |
| PUT    | `/finalAverages/updateFinalAverageById/{id}`                     | Atualiza média final                                  | ✅   | dados da média |
| DELETE | `/finalAverages/deleteFinalAverageById/{id}`                     | Deleta média final (lógico)                           | ✅   | — |

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                  | Auth |
|--------|-----------|---------------------------|------|
| GET    | `/health` | Verifica status da API     | ❌   |

---

## 🔐 Autenticação

- ✅ = Requer token JWT
- ❌ = Público
