import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Panier extends Model {}

Panier.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // client_id = ID Better Auth (texte). Voir avoir.model.ts pour la raison.
    clientId: { type: DataTypes.TEXT, allowNull: true, field: 'client_id' },
    statutCommande: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'en_cours', field: 'statut_commande' },
    adresseLivraison: { type: DataTypes.TEXT, allowNull: true, field: 'adresse_livraison' },
    prixTotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: '0', field: 'prix_total' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  },
  {
    sequelize,
    tableName: 'panier',
    timestamps: false,
  },
);
