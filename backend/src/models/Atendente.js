const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Atendente extends Model {}

Atendente.init(
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM('atendente', 'gestor'),
      allowNull: false,
      defaultValue: 'atendente',
    },
  },
  {
    sequelize,
    modelName: 'Atendente',
    tableName: 'atendentes',
    timestamps: true,
  }
);

module.exports = Atendente;
