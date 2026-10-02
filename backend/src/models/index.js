const sequelize = require('../config/database');
const Senha = require('./Senha');
const Atendente = require('./Atendente');
const Guiche = require('./Guiche');

// Associações
Senha.belongsTo(Atendente, { foreignKey: 'atendenteId', allowNull: true });
Senha.belongsTo(Guiche, { foreignKey: 'guicheId', allowNull: true });

module.exports = {
  sequelize,
  Senha,
  Atendente,
  Guiche,
};
