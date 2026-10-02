const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Guiche extends Model {}

Guiche.init(
  {
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('livre', 'ocupado'),
      allowNull: false,
      defaultValue: 'livre',
    },
  },
  {
    sequelize,
    modelName: 'Guiche',
    tableName: 'guiches',
    timestamps: false,
  }
);

module.exports = Guiche;
