import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Stock extends Model {}

Stock.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productName: { type: DataTypes.TEXT, allowNull: false, field: 'product_name' },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    accountingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'accounting_price' },
  },
  {
    sequelize,
    tableName: 'stocks',
    timestamps: false,
  },
);
