# NassauTickets

Sistema de gestão e controle de filas de atendimento com ordenação prioritária e acompanhamento em painel.

## Language

### Senhas e Fila

**Senha**:
Identificador único diário atribuído a um cliente para aguardar e receber atendimento no guichê.
_Avoid_: Ticket, bilhete, ficha

**Tipo de Senha**:
Classificação da prioridade de atendimento: `SP` (Prioritária), `SE` (Especial) ou `SG` (Geral).
_Avoid_: Categoria, classe, modalidade

**Estado da Senha**:
Situação atual da senha no fluxo de atendimento (`EMITIDA`, `AGUARDANDO`, `CHAMADA`, `CHAMADA_NOVAMENTE`, `EM_ATENDIMENTO`, `ATENDIDA`, `NAO_COMPARECEU`).
_Avoid_: Status, fase, etapa

**Não Comparecimento**:
Condição definitiva atribuída a uma senha cujo cliente não se apresentou após duas chamadas no guichê.
_Avoid_: Desistência, abandono, cancelamento

### Atores e Estrutura

**Guichê**:
Ponto físico de atendimento onde o atendente recebe o cliente portador de uma senha chamada.
_Avoid_: Balcão, mesa, cabine

**Atendente**:
Usuário do sistema responsável por chamar senhas, registrar início e conclusão do atendimento no guichê.
_Avoid_: Operador, funcionário

**Gestor**:
Usuário com privilégios administrativos responsável por visualizar relatórios diários, mensais e auditoria.
_Avoid_: Administrador, gerente, supervisor

**Painel**:
Interface visual e sonora que exibe para os clientes as últimas 5 senhas chamadas e os respectivos guichês.
_Avoid_: Display, monitor, tela
