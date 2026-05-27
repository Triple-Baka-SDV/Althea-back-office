import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Session extends Model {}

Session.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    ipAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ip_address',
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'user_agent',
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'user_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: true,
    underscored: true,
  },
);
