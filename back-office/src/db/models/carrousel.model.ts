import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Carrousel extends Model {}

Carrousel.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  },
  {
    sequelize,
    tableName: 'carrousel',
    timestamps: false,
  },
);

export class CarrouselItem extends Model {}

CarrouselItem.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    carrouselId: { type: DataTypes.INTEGER, allowNull: true, field: 'carrousel_id' },
    imageId: { type: DataTypes.TEXT, allowNull: false, field: 'image_url' },
    title: { type: DataTypes.TEXT, allowNull: true },
    subtitle: { type: DataTypes.TEXT, allowNull: true },
    order: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: 'carrousel_items',
    timestamps: false,
  },
);
