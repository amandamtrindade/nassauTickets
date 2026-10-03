# Pendências para a Segunda Etapa

## PEND-01 – Controle de Expediente

Implementar o funcionamento do sistema apenas entre 07h e 17h, com descarte automático das senhas restantes ao final do expediente.

---

## PEND-02 – Controle de Concorrência

Garantir o tratamento de situações em que dois atendentes solicitem a próxima senha simultaneamente.

---

## PEND-03 – Gestão de Senhas Não Atendidas

Considerar que aproximadamente 5% das senhas emitidas podem não resultar em atendimento devido à ausência ou desistência do cliente.

Definir o tratamento dessas ocorrências, marcando a senha como não atendida após duas chamadas sem resposta.

Registrar essas informações para fins de relatórios e análise operacional.

---

## PEND-04 – Cobertura de Testes Automatizados

Desenvolver testes unitários para as regras de negócio.

Implementar testes de integração para filas, concorrência e descarte diário de senhas.

Validar os principais fluxos e cenários de exceção do sistema.