import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Facture extends Model {}

Facture.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    dateCreation: { type: DataTypes.DATE, field: 'date_creation' },
    client: { type: DataTypes.TEXT, allowNull: true },
    montant: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    commandeId: { type: DataTypes.INTEGER, allowNull: true, field: 'commande_id' },
    dateEmission: { type: DataTypes.DATE, allowNull: true, field: 'date_emission' },
    statut: { type: DataTypes.TEXT, defaultValue: 'en_attente' },
    userId: { type: DataTypes.INTEGER, allowNull: true, field: 'user_id' },
    paiementId: { type: DataTypes.INTEGER, allowNull: true, field: 'paiement_id' },
  },
  {
    sequelize,
    tableName: 'factures',
    timestamps: false,
  },
);
