# Regras de Negócio

RN01 – Senhas do tipo SP possuem maior prioridade no atendimento.

RN02 – Senhas do tipo SG possuem menor prioridade no atendimento.

RN03 – Senhas do tipo SE devem ser chamadas após uma senha SP, quando houver disponibilidade na fila.

RN04 – Senhas não atendidas após duas chamadas consecutivas devem ser classificadas como abandonadas.

RN05 – O expediente do sistema ocorre das 07h às 17h.

RN06 – Ao final do expediente, as senhas remanescentes devem ser descartadas.

RN07 – O painel deve exibir apenas as cinco últimas senhas chamadas.