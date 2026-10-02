require('dotenv').config();
const test = require('node:test');
const assert = require('node:assert');
const jwt = require('jsonwebtoken');
const app = require('../../src/app');
const { Senha, Atendente, Guiche, sequelize } = require('../../src/models');
const { resetEstadoFila } = require('../../src/services/filaService');

test('Integração: Fluxo completo de atendimento e prioridades', async (t) => {
  await sequelize.authenticate();
  await sequelize.sync();

  // Garante que guichê e atendentes existam
  await Guiche.findOrCreate({ where: { numero: 1 }, defaults: { status: 'livre' } });
  const [atendente] = await Atendente.findOrCreate({
    where: { login: 'atendente_test' },
    defaults: { nome: 'Atendente Teste', perfil: 'atendente', senhaHash: 'hash' },
  });
  const [gestor] = await Atendente.findOrCreate({
    where: { login: 'gestor_test' },
    defaults: { nome: 'Gestor Teste', perfil: 'gestor', senhaHash: 'hash' },
  });

  const tokenAtendente = jwt.sign(
    { id: atendente.id, login: atendente.login, perfil: 'atendente' },
    process.env.JWT_SECRET || 'secret'
  );
  const tokenGestor = jwt.sign(
    { id: gestor.id, login: gestor.login, perfil: 'gestor' },
    process.env.JWT_SECRET || 'secret'
  );

  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  t.after(async () => {
    server.close();
  });

  // Limpa senhas para teste determinístico e zera a alternância em memória
  await Senha.destroy({ where: {}, truncate: false });
  resetEstadoFila();

  // 1. Fila vazia
  await t.test('Chamar em fila vazia deve retornar 200 com mensagem informativa', async () => {
    const res = await fetch(`${baseUrl}/atendimento/chamar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ guicheId: 1 }),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.mensagem, 'Nenhuma senha aguardando na fila');
  });

  // 2. Emissão com tipo inválido
  await t.test('Emitir senha com tipo inválido deve retornar 400', async () => {
    const res = await fetch(`${baseUrl}/senhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'XYZ' }),
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.erro, 'Tipo de senha inválido');
  });

  // 3. Emissão: SP, SP, SE, SE, SG, SG, SP
  const senhasEmitidas = [];
  await t.test('Emitir sequência SP, SP, SE, SE, SG, SG, SP no formato YYMMDD-PPSQ', async () => {
    const sequencia = ['SP', 'SP', 'SE', 'SE', 'SG', 'SG', 'SP'];

    for (const tipo of sequencia) {
      const res = await fetch(`${baseUrl}/senhas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }),
      });

      assert.strictEqual(res.status, 201);
      const data = await res.json();
      assert.strictEqual(data.tipo, tipo);
      assert.strictEqual(data.estado, 'AGUARDANDO');
      senhasEmitidas.push(data);
    }

    assert.strictEqual(senhasEmitidas.length, 7);
    assert.match(senhasEmitidas[0].numero, /SP001$/);
    assert.match(senhasEmitidas[1].numero, /SP002$/);
    assert.match(senhasEmitidas[2].numero, /SE001$/);
    assert.match(senhasEmitidas[3].numero, /SE002$/);
    assert.match(senhasEmitidas[4].numero, /SG001$/);
    assert.match(senhasEmitidas[5].numero, /SG002$/);
    assert.match(senhasEmitidas[6].numero, /SP003$/);
  });

  // 4. Chamada respeitando ordem de prioridade
  // Esperado: SP001, SE001, SP002, SE002, SP003, SG001, SG002
  const senhasChamadas = [];
  await t.test('Ordem de prioridade na chamada (SP -> SE/SG alternado)', async () => {
    const ordemEsperada = ['SP001', 'SE001', 'SP002', 'SE002', 'SP003', 'SG001', 'SG002'];

    for (let i = 0; i < 7; i++) {
      await new Promise((r) => setTimeout(r, 5));
      const res = await fetch(`${baseUrl}/atendimento/chamar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenAtendente}`,
        },
        body: JSON.stringify({ guicheId: 1 }),
      });

      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.estado, 'CHAMADA');
      assert.match(data.numero, new RegExp(`${ordemEsperada[i]}$`));
      senhasChamadas.push(data);
    }
  });

  // 5. Painel com no máximo 5 senhas
  await t.test('Painel deve conter no máximo as 5 últimas senhas chamadas', async () => {
    const res = await fetch(`${baseUrl}/senhas/painel`);
    assert.strictEqual(res.status, 200);
    const painel = await res.json();

    assert.strictEqual(painel.length, 5);
    // Mais recente primeiro: SG002
    assert.match(painel[0].numero, /SG002$/);
    assert.match(painel[1].numero, /SG001$/);
    assert.match(painel[2].numero, /SP003$/);
    assert.match(painel[3].numero, /SE002$/);
    assert.match(painel[4].numero, /SP002$/);
  });

  // 6. Ciclo de atendimento: Iniciar e Finalizar
  await t.test('Ciclo completo: Iniciar -> Finalizar e conferir estado no banco', async () => {
    const primeira = senhasChamadas[0]; // SP001

    // Iniciar
    const resIniciar = await fetch(`${baseUrl}/atendimento/iniciar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ senhaId: primeira.id, atendenteId: atendente.id }),
    });

    assert.strictEqual(resIniciar.status, 200);
    const dataIniciar = await resIniciar.json();
    assert.strictEqual(dataIniciar.estado, 'EM_ATENDIMENTO');
    assert.ok(dataIniciar.inicioAtendimento);

    // Finalizar
    const resFinalizar = await fetch(`${baseUrl}/atendimento/finalizar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ senhaId: primeira.id }),
    });

    assert.strictEqual(resFinalizar.status, 200);
    const dataFinalizar = await resFinalizar.json();
    assert.strictEqual(dataFinalizar.estado, 'ATENDIDA');
    assert.ok(dataFinalizar.fimAtendimento);

    // Confere no banco de dados
    const noBanco = await Senha.findByPk(primeira.id);
    assert.strictEqual(noBanco.estado, 'ATENDIDA');
    assert.ok(noBanco.inicioAtendimento);
    assert.ok(noBanco.fimAtendimento);
  });

  // 7. Relatório diário e RBAC
  await t.test('Atendente bloqueado (403) e Gestor aprovado (200) com senha atendida contada', async () => {
    // Atendente tentando acessar relatório
    const resAtendente = await fetch(`${baseUrl}/relatorios/diario`, {
      headers: { Authorization: `Bearer ${tokenAtendente}` },
    });
    assert.strictEqual(resAtendente.status, 403);
    const erroAtendente = await resAtendente.json();
    assert.strictEqual(erroAtendente.erro, 'Acesso restrito ao gestor');

    // Gestor acessando relatório
    const resGestor = await fetch(`${baseUrl}/relatorios/diario`, {
      headers: { Authorization: `Bearer ${tokenGestor}` },
    });
    assert.strictEqual(resGestor.status, 200);
    const dadosRelatorio = await resGestor.json();
    assert.strictEqual(dadosRelatorio.atendidas, 1);
    assert.strictEqual(dadosRelatorio.emitidas, 7);
  });

  // 8. Rechamada e Não Comparecimento após duas chamadas
  await t.test('Rechamada, rejeição de 3ª chamada e marcação de não comparecimento', async () => {
    const segunda = senhasChamadas[1]; // SE001

    // Rechamada (2ª chamada)
    const resRechamar = await fetch(`${baseUrl}/atendimento/chamar-novamente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ senhaId: segunda.id }),
    });
    assert.strictEqual(resRechamar.status, 200);
    const dataRechamar = await resRechamar.json();
    assert.strictEqual(dataRechamar.estado, 'CHAMADA_NOVAMENTE');
    assert.ok(dataRechamar.segundaChamada);

    // 3ª chamada inválida (erro 400 da máquina de estados)
    const resTerceira = await fetch(`${baseUrl}/atendimento/chamar-novamente`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ senhaId: segunda.id }),
    });
    assert.strictEqual(resTerceira.status, 400);

    // Não comparecimento
    const resAusencia = await fetch(`${baseUrl}/atendimento/nao-compareceu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenAtendente}`,
      },
      body: JSON.stringify({ senhaId: segunda.id }),
    });
    assert.strictEqual(resAusencia.status, 200);
    const dataAusencia = await resAusencia.json();
    assert.strictEqual(dataAusencia.estado, 'NAO_COMPARECEU');

    // Confere no banco
    const noBanco = await Senha.findByPk(segunda.id);
    assert.strictEqual(noBanco.estado, 'NAO_COMPARECEU');
  });

  // 9. Rotas sem token
  await t.test('Rotas protegidas sem token devem retornar 401', async () => {
    const res1 = await fetch(`${baseUrl}/atendimento/chamar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guicheId: 1 }),
    });
    assert.strictEqual(res1.status, 401);

    const res2 = await fetch(`${baseUrl}/relatorios/diario`);
    assert.strictEqual(res2.status, 401);
  });
});
