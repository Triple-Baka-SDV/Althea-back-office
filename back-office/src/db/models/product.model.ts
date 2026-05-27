import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Product extends Model {}

Product.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    names: { type: DataTypes.TEXT, allowNull: false },
    unitaryPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'unitary_price' },
    description: { type: DataTypes.TEXT, allowNull: true },
    characteristics: { type: DataTypes.TEXT, allowNull: true },
    title: { type: DataTypes.TEXT, allowNull: true },
    accountingPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'accounting_price' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    typeId: { type: DataTypes.INTEGER, allowNull: true, field: 'type_id' },
    categoryId: { type: DataTypes.INTEGER, allowNull: true, field: 'category_id' },
    stockId: { type: DataTypes.INTEGER, allowNull: true, field: 'stock_id' },
    taxeId: { type: DataTypes.INTEGER, allowNull: true, field: 'taxe_id' },
    linkPix: { type: DataTypes.TEXT, allowNull: true, field: 'link_pix' },
    lastUpdate: { type: DataTypes.DATE, field: 'last_update' },
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: false,
  },
);
