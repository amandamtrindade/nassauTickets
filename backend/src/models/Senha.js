const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Senha extends Model {}

Senha.init(
  {
    numero: {
      type: DataTypes.STRING(12), // formato YYMMDD-PPSQ
      allowNull: false,
      unique: true,
    },
    tipo: {
      type: DataTypes.ENUM('SP', 'SG', 'SE'),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(
        'EMITIDA',
        'AGUARDANDO',
        'CHAMADA',
        'CHAMADA_NOVAMENTE',
        'EM_ATENDIMENTO',
        'ATENDIDA',
        'NAO_COMPARECEU'
      ),
      allowNull: false,
      defaultValue: 'EMITIDA',
    },
    guicheId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    atendenteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    dataEmissao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    primeiraChamada: { type: DataTypes.DATE, allowNull: true },
    segundaChamada: { type: DataTypes.DATE, allowNull: true },
    inicioAtendimento: { type: DataTypes.DATE, allowNull: true },
    fimAtendimento: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    modelName: 'Senha',
    tableName: 'senhas',
    timestamps: false,
  }
);

module.exports = Senha;
