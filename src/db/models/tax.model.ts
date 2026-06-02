import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Tax extends Model {}

Tax.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nom: { type: DataTypes.TEXT, allowNull: false },
    taux: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  },
  {
    sequelize,
    tableName: 'taxes',
    timestamps: false,
  },
);
