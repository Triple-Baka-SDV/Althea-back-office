import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Avoir extends Model {}

Avoir.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idSupprime: { type: DataTypes.INTEGER, allowNull: true, field: 'id_supprime' },
    infosSupprimees: { type: DataTypes.TEXT, allowNull: true, field: 'infos_supprimees' },
    dateCreation: { type: DataTypes.DATE, field: 'date_creation' },
    motif: { type: DataTypes.TEXT, allowNull: true },
    statut: { type: DataTypes.TEXT, defaultValue: 'en_cours_de_remboursement' },
    montant: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    clientId: { type: DataTypes.INTEGER, allowNull: true, field: 'client_id' },
  },
  {
    sequelize,
    tableName: 'avoirs',
    timestamps: false,
  },
);
