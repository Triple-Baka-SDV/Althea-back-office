import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.TEXT, allowNull: false, unique: true },
    mail: { type: DataTypes.TEXT, allowNull: false, unique: true },
    role: { type: DataTypes.TEXT, allowNull: false },
    lastName: { type: DataTypes.TEXT, allowNull: true, field: 'last_name' },
    firstName: { type: DataTypes.TEXT, allowNull: true, field: 'first_name' },
    phoneNumber: { type: DataTypes.TEXT, allowNull: true, field: 'phone_number' },
    password: { type: DataTypes.TEXT, allowNull: false, field: 'mots_de_passe' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false, // pas de updatedAt dans ta table users
  },
);
