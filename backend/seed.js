require('dotenv').config();
const sequelize = require('./src/config/database');
const Guiche = require('./src/models/Guiche');
const Atendente = require('./src/models/Atendente');

async function seed() {
  await sequelize.sync();

  for (const numero of [1, 2, 3]) {
    await Guiche.findOrCreate({
      where: { numero },
      defaults: { status: 'livre' },
    });
  }

  await Atendente.findOrCreate({
    where: { login: 'atendente1' },
    defaults: { nome: 'Atendente Teste', senhaHash: 'TROCAR_QUANDO_TIVER_LOGIN', perfil: 'atendente' },
  });

  await Atendente.findOrCreate({
    where: { login: 'gestor1' },
    defaults: { nome: 'Gestor Teste', senhaHash: 'TROCAR_QUANDO_TIVER_LOGIN', perfil: 'gestor' },
  });

  console.log('Seed concluído.');
  await sequelize.close();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});