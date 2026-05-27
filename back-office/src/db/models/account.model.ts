import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'account_id',
    },
    providerId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'provider_id',
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'user_id',
    },
    // Le mot de passe est dans accounts, pas dans users (pattern Better Auth)
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'accounts',
    timestamps: true,
    underscored: true,
  },
);
