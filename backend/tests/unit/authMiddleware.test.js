const test = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const { exigirLogin, apenasGestor } = require('../../src/middlewares/authMiddleware');

process.env.JWT_SECRET = 'teste_secret_jwt';

test('authMiddleware: exigirLogin sem cabeçalho Authorization deve retornar 401', () => {
  const req = { headers: {} };
  let statusCode = null;
  let jsonResponse = null;
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResponse = data;
        },
      };
    },
  };
  let nextCalled = false;

  exigirLogin(req, res, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, false);
  assert.strictEqual(statusCode, 401);
  assert.strictEqual(jsonResponse.erro, 'Token não informado');
});

test('authMiddleware: exigirLogin com token inválido deve retornar 401', () => {
  const req = { headers: { authorization: 'Bearer token_invalido' } };
  let statusCode = null;
  let jsonResponse = null;
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResponse = data;
        },
      };
    },
  };
  let nextCalled = false;

  exigirLogin(req, res, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, false);
  assert.strictEqual(statusCode, 401);
  assert.strictEqual(jsonResponse.erro, 'Token inválido ou expirado');
});

test('authMiddleware: exigirLogin com token válido preenche req.usuario e chama next', () => {
  const payload = { id: 1, login: 'atendente1', perfil: 'atendente' };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  const req = { headers: { authorization: `Bearer ${token}` } };
  let nextCalled = false;

  exigirLogin(req, {}, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, true);
  assert.strictEqual(req.usuario.id, 1);
  assert.strictEqual(req.usuario.login, 'atendente1');
});

test('authMiddleware: apenasGestor bloqueia perfil atendente com 403', () => {
  const req = { usuario: { id: 1, perfil: 'atendente' } };
  let statusCode = null;
  let jsonResponse = null;
  const res = {
    status(code) {
      statusCode = code;
      return {
        json(data) {
          jsonResponse = data;
        },
      };
    },
  };
  let nextCalled = false;

  apenasGestor(req, res, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, false);
  assert.strictEqual(statusCode, 403);
  assert.strictEqual(jsonResponse.erro, 'Acesso restrito ao gestor');
});

test('authMiddleware: apenasGestor permite perfil gestor chamando next', () => {
  const req = { usuario: { id: 2, perfil: 'gestor' } };
  let nextCalled = false;

  apenasGestor(req, {}, () => {
    nextCalled = true;
  });

  assert.strictEqual(nextCalled, true);
});
