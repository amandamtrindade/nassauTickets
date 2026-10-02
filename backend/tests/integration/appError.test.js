const test = require('node:test');
const assert = require('node:assert');
const app = require('../../src/app');

test('app: erro de sintaxe JSON do cliente deve retornar status 400 (nunca 500)', async () => {
  const server = app.listen(0);
  const port = server.address().port;

  try {
    const response = await fetch(`http://localhost:${port}/senhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ json_invalido_sem_fechar_chaves: true ',
    });

    const data = await response.json();
    assert.strictEqual(response.status, 400, `Esperado 400, mas retornou ${response.status}`);
    assert.ok(data.erro);
  } finally {
    server.close();
  }
});
