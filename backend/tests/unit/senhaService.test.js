const test = require('node:test');
const assert = require('node:assert');
const { podeTransicionar } = require('../../src/services/senhaService');

test('senhaService: transições válidas da máquina de estados', () => {
  // EMITIDA -> AGUARDANDO
  assert.strictEqual(podeTransicionar('EMITIDA', 'AGUARDANDO'), true);
  assert.strictEqual(podeTransicionar('EMITIDA', 'CHAMADA'), false);

  // AGUARDANDO -> CHAMADA
  assert.strictEqual(podeTransicionar('AGUARDANDO', 'CHAMADA'), true);
  assert.strictEqual(podeTransicionar('AGUARDANDO', 'EM_ATENDIMENTO'), false);

  // CHAMADA -> CHAMADA_NOVAMENTE, EM_ATENDIMENTO, NAO_COMPARECEU
  assert.strictEqual(podeTransicionar('CHAMADA', 'CHAMADA_NOVAMENTE'), true);
  assert.strictEqual(podeTransicionar('CHAMADA', 'EM_ATENDIMENTO'), true);
  assert.strictEqual(podeTransicionar('CHAMADA', 'NAO_COMPARECEU'), true);
  assert.strictEqual(podeTransicionar('CHAMADA', 'ATENDIDA'), false);

  // CHAMADA_NOVAMENTE -> EM_ATENDIMENTO, NAO_COMPARECEU
  assert.strictEqual(podeTransicionar('CHAMADA_NOVAMENTE', 'EM_ATENDIMENTO'), true);
  assert.strictEqual(podeTransicionar('CHAMADA_NOVAMENTE', 'NAO_COMPARECEU'), true);
  assert.strictEqual(podeTransicionar('CHAMADA_NOVAMENTE', 'CHAMADA_NOVAMENTE'), false); // Proibido 3ª chamada!

  // EM_ATENDIMENTO -> ATENDIDA
  assert.strictEqual(podeTransicionar('EM_ATENDIMENTO', 'ATENDIDA'), true);
  assert.strictEqual(podeTransicionar('EM_ATENDIMENTO', 'NAO_COMPARECEU'), false);

  // Estados finais (sem transição permitida)
  assert.strictEqual(podeTransicionar('ATENDIDA', 'AGUARDANDO'), false);
  assert.strictEqual(podeTransicionar('NAO_COMPARECEU', 'CHAMADA'), false);
});
