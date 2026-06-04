import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

export class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productsId: { type: DataTypes.INTEGER, allowNull: true, field: 'products_id' },
    // client_id = ID Better Auth (texte). Voir avoir.model.ts pour la raison.
    clientId: { type: DataTypes.TEXT, allowNull: true, field: 'client_id' },
    adresseId: { type: DataTypes.INTEGER, allowNull: true, field: 'adresse_id' },
    adress: { type: DataTypes.TEXT, allowNull: true },
    productName: { type: DataTypes.TEXT, allowNull: true, field: 'product_name' },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    unitaryPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: 'unitary_price' },
    taxRate: { type: DataTypes.DECIMAL(5, 2), allowNull: true, field: 'tax_rate' },
    status: { type: DataTypes.TEXT, defaultValue: 'en_attente' },
    commandeRef: { type: DataTypes.TEXT, allowNull: true, field: 'commande_ref' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: false,
  },
);
