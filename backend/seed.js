require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const Guiche = require('./src/models/Guiche');
const Atendente = require('./src/models/Atendente');

const usuarios = [
  { login: 'atendente1', nome: 'Atendente Teste', perfil: 'atendente', senha: 'atendente123' },
  { login: 'gestor1', nome: 'Gestor Teste', perfil: 'gestor', senha: 'gestor123' },
];

async function seed() {
  await sequelize.sync();

  for (const numero of [1, 2, 3]) {
    await Guiche.findOrCreate({
      where: { numero },
      defaults: { status: 'livre' },
    });
  }

  for (const u of usuarios) {
    const senhaHash = await bcrypt.hash(u.senha, 10);

    const [atendente] = await Atendente.findOrCreate({
      where: { login: u.login },
      defaults: { nome: u.nome, perfil: u.perfil, senhaHash },
    });

    // Se já existia, atualiza o hash (troca o texto provisório pela senha criptografada)
    await atendente.update({ nome: u.nome, perfil: u.perfil, senhaHash });
  }

  console.log('Seed concluído.');
  console.log('Logins de teste: atendente1 / atendente123  |  gestor1 / gestor123');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});