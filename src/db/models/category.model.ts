import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Category extends Model {}

Category.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    icones: { type: DataTypes.TEXT, allowNull: true },
    nom: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: false,
  },
);
