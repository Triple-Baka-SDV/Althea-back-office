import { DataTypes, Model } from 'sequelize';

import { sequelize } from '../connection.js';

import { Facture } from './facture.model.js';
import { Order } from './order.model.js';

export class Avoir extends Model {
  declare id: number;
  declare idSupprime: number | null;
  declare statut: string | null;
}

Avoir.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    idSupprime: { type: DataTypes.INTEGER, allowNull: true, field: 'id_supprime' },
    infosSupprimees: { type: DataTypes.TEXT, allowNull: true, field: 'infos_supprimees' },
    dateCreation: { type: DataTypes.DATE, field: 'date_creation' },
    motif: { type: DataTypes.TEXT, allowNull: true },
    statut: { type: DataTypes.TEXT, defaultValue: 'en_cours_de_remboursement' },
    montant: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    // client_id stocke un ID utilisateur Better Auth (texte), pas un entier.
    // Sequelize devait être en STRING sinon AdminJS écrit NULL en save.
    clientId: { type: DataTypes.TEXT, allowNull: true, field: 'client_id' },
  },
  {
    sequelize,
    tableName: 'avoirs',
    timestamps: false,
  },
);

// Quand l'admin passe un avoir à "remboursé" dans le back-office, on cascade
// le statut sur la facture liée (id_supprime) et sur toutes les commandes
// partageant son commande_ref. Sans ça, l'utilisateur ne voit pas le
// remboursement côté front.
const REFUNDED_VALUES = new Set(['rembourse', 'remboursé', 'remboursee', 'remboursée']);

Avoir.addHook('afterUpdate', async (instance: Avoir) => {
  if (!instance.changed('statut')) return;
  if (!REFUNDED_VALUES.has(String(instance.statut ?? ''))) return;
  if (instance.idSupprime == null) return;

  const facture = await Facture.findByPk(instance.idSupprime);
  if (!facture) return;

  await facture.update({ statut: 'remboursee' });

  const ref = (facture.get('commandeRef') as string | null) ?? null;
  if (ref) {
    await Order.update({ status: 'remboursee' }, { where: { commandeRef: ref } });
  } else {
    const commandeId = facture.get('commandeId') as number | null;
    if (commandeId != null) {
      await Order.update({ status: 'remboursee' }, { where: { id: commandeId } });
    }
  }
});
