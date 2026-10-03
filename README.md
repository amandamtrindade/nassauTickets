# nassauTickets
## Descrição
O NassauTickets é um sistema de gerenciamento de filas desenvolvido com o intuito de organizar, otimizar e dar celeridade no processo de atendimento ao público. A aplicação permite a emissão de senhas, o controle da ordem de atendimento e a exibição das chamadas em um painel, garantindo maior eficiência e transparência no fluxo de atendimento.
O sistema contempla diferentes tipos de senhas com regras de prioridade específicas, além de funcionalidades voltadas para os atendentes, como chamada de senhas, início e finalização de atendimentos e acompanhamento da fila em tempo real.
## Objetivo
Desenvolver uma solução capaz de gerenciar filas de atendimento de forma organizada, priorizando corretamente os diferentes tipos de senhas e proporcionando uma experiência mais eficiente para clientes e atendentes. O projeto tem como finalidade aplicar conceitos de desenvolvimento de software, modelagem de sistemas, banco de dados e documentação técnica, integrando conhecimentos adquiridos ao longo da disciplina.
## Tecnologias
- Node.js LTS 22 
- MySQL 8.0 (recomendado via XAMPP, que já inclui o phpMyAdmin)
- ⁠React 19
## Arquitetura
O sistema segue uma arquitetura cliente-servidor com API REST:

- **Backend**: Node.js + Express, organizado em camadas
  - `models/`: representam as tabelas do banco (Senha, Atendente, Guichê)
  - `services/`: regras de negócio (geração de número da senha, máquina de estados, fila de prioridade)
  - `controllers/`: recebem as requisições HTTP e chamam os services
  - `routes/`: definem os endpoints da API
- **Banco de dados**: MySQL, acessado via Sequelize (ORM)
- **Frontend**: React, consome a API via requisições HTTP (fetch)
- **Agentes do sistema**: Totem (Cliente), Painel (exibição pública) e Terminal do Atendente, todos acessando o mesmo backend.
## Instrução de instalação
Pré-requisitos:
- Node.js LTS 22 instalado
- MySQL 8.0 (recomendado via XAMPP, que já inclui o phpMyAdmin)

Passos:
1. Clonar o repositório
2. Criar um banco de dados chamado `nassautickets` no MySQL
3. Entrar na pasta `backend/` e copiar `.env.example` para `.env`
4. Preencher o `.env` com os dados do seu banco local
5. Rodar `npm install` para instalar as dependências
## Instrução de execução
1. Ligar o MySQL no XAMPP e criar o banco nassautickets no phpMyAdmin
2. Na pasta backend: copiar .env.example para .env
3. npm install
4. npm run seed (cria guichês 1, 2, 3 e atendentes de teste)
5. npm run dev (API em http://localhost:3333)
### *Rotas (todas em http://localhost:3333)*
- POST /senhas → { "tipo": "SP" }
- GET /senhas/painel
- POST /atendimento/chamar → { "guicheId": 1 }
- POST /atendimento/chamar-novamente → { "senhaId": 1 }
- POST /atendimento/nao-compareceu → { "senhaId": 1 }
- POST /atendimento/iniciar → { "senhaId": 1, "atendenteId": 1 }
- POST /atendimento/finalizar → { "senhaId": 1 }
## Configuração
O backend usa variáveis de ambiente, definidas no arquivo `.env` (um exemplo está em `.env.example`):
| Variável | Descrição |
|----------|-----------|
| PORT | Porta onde o servidor backend roda (padrão: 3333) |
| DB_HOST | Endereço do banco de dados (padrão: localhost) |
| DB_PORT | Porta do MySQL (padrão: 3306) |
| DB_NAME | Nome do banco de dados (nassautickets) |
| DB_USER | Usuário do MySQL (padrão: root) |
| DB_PASSWORD | Senha do MySQL (vazio no XAMPP por padrão) |
## Branches
| Branch | Descrição |
|----------|----------|
| main | Branch principal do projeto. |
| dev | Branch utilizada para integração e desenvolvimento das funcionalidades. |
| feature/frontend | Branch destinada ao desenvolvimento da interface do sistema. |
| feat/testes-backend | Branch destinada à validação dos testes do backend. |
## Membros  
| Nome | Matrícula | Papel |
|------|-----------|-------|
| Camila Souza | 01875506 | Documentação|
| Maiara Camarotti | 01935636 | Teste |
| Amanda Medeiros |01896858 | Scrum Master |
| Victory Lesson | 01887163 | Desenvolvedor |
| Maria Cecília | 01877489 | Desenvolvedora|
| Victor Emmanuel | 01942107 |Teste   |
## Considerações
Após a sessão de testes (conforme solicitado e documentado), asseguramos   que o sistema está funcionando corretamente, atendendo à solicitação proposta na atividade.







