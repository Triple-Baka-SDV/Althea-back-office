import AdminJS from 'adminjs';
import AdminJSSequelize from '@adminjs/sequelize';
import { ComponentLoader } from 'adminjs';

import {
  User,
  Product,
  Category,
  Stock,
  Tax,
  Order,
  Facture,
  Avoir,
  Panier,
  Carrousel,
  CarrouselItem,
} from '../db/models/index.js';

AdminJS.registerAdapter(AdminJSSequelize);

const componentLoader = new ComponentLoader();

// ======================
// ADMIN CONFIG
// ======================
export const admin = new AdminJS({
  componentLoader,

  resources: [
    // ── UTILISATEURS ──────────────────────────────
    {
      resource: User,
      options: {
        navigation: { name: 'Utilisateurs', icon: 'User' },
        listProperties: ['id', 'username', 'mail', 'role', 'firstName', 'lastName', 'createdAt'],
        filterProperties: ['role', 'mail', 'username'],
        showProperties: ['id', 'username', 'mail', 'role', 'firstName', 'lastName', 'phoneNumber', 'createdAt'],
        editProperties: ['username', 'mail', 'role', 'firstName', 'lastName', 'phoneNumber'],
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
        },
        properties: {
          // Le mot de passe est dans la table accounts, on le cache partout
          password: {
            isVisible: { list: false, show: false, edit: false, filter: false },
          },
        },
      },
    },

    // ── PRODUITS ──────────────────────────────────
    {
      resource: Product,
      options: {
        navigation: { name: 'Catalogue', icon: 'Box' },
        listProperties: ['id', 'names', 'unitaryPrice', 'active', 'categoryId', 'taxeId', 'lastUpdate'],
        filterProperties: ['active', 'categoryId', 'taxeId', 'names'],
        showProperties: [
          'id',
          'names',
          'title',
          'description',
          'characteristics',
          'unitaryPrice',
          'accountingPrice',
          'active',
          'categoryId',
          'typeId',
          'stockId',
          'taxeId',
          'linkPix',
          'lastUpdate',
        ],
        editProperties: [
          'names',
          'title',
          'description',
          'characteristics',
          'unitaryPrice',
          'accountingPrice',
          'active',
          'categoryId',
          'typeId',
          'stockId',
          'taxeId',
          'linkPix',
        ],
        actions: {
          delete: {
            // Demande de confirmation avant suppression
            guard: 'Confirmer la suppression de ce produit ?',
          },
        },
      },
    },

    // ── CATÉGORIES ────────────────────────────────
    {
      resource: Category,
      options: {
        navigation: { name: 'Catalogue', icon: 'Tag' },
        listProperties: ['id', 'nom', 'icones'],
        editProperties: ['nom', 'icones'],
      },
    },

    // ── STOCKS ────────────────────────────────────
    {
      resource: Stock,
      options: {
        navigation: { name: 'Catalogue', icon: 'Package' },
        listProperties: ['id', 'productName', 'quantity', 'accountingPrice'],
        filterProperties: ['productName', 'quantity'],
        editProperties: ['productName', 'quantity', 'accountingPrice'],
        actions: {
          delete: { isAccessible: false },
        },
      },
    },

    // ── TAXES ─────────────────────────────────────
    {
      resource: Tax,
      options: {
        navigation: { name: 'Catalogue', icon: 'Percent' },
        listProperties: ['id', 'nom', 'taux'],
        editProperties: ['nom', 'taux'],
      },
    },

    // ── COMMANDES ─────────────────────────────────
    {
      resource: Order,
      options: {
        navigation: { name: 'Commandes', icon: 'Receipt' },
        listProperties: ['id', 'productName', 'clientId', 'quantity', 'unitaryPrice', 'status', 'createdAt'],
        filterProperties: ['status', 'clientId', 'productsId'],
        showProperties: [
          'id',
          'productName',
          'clientId',
          'productsId',
          'adresseId',
          'adress',
          'quantity',
          'unitaryPrice',
          'taxRate',
          'status',
          'createdAt',
        ],
        editProperties: ['status'], // seul le statut est modifiable
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
        },
        properties: {
          status: {
            availableValues: [
              { value: 'en_attente', label: '🟡 En attente' },
              { value: 'en_cours', label: '🔵 En cours' },
              { value: 'terminee', label: '🟢 Terminée' },
              { value: 'annulee', label: '🔴 Annulée' },
            ],
          },
        },
      },
    },

    // ── FACTURES ──────────────────────────────────
    {
      resource: Facture,
      options: {
        navigation: { name: 'Facturation', icon: 'FileInvoice' },
        listProperties: ['id', 'client', 'montant', 'statut', 'dateCreation', 'commandeId'],
        filterProperties: ['statut', 'client', 'userId'],
        showProperties: [
          'id',
          'client',
          'montant',
          'statut',
          'dateCreation',
          'dateEmission',
          'commandeId',
          'userId',
          'paiementId',
        ],
        editProperties: ['statut'],
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
        },
        properties: {
          statut: {
            availableValues: [
              { value: 'en_attente', label: 'En attente' },
              { value: 'payee', label: 'Payée' },
              { value: 'annulee', label: 'Annulée' },
            ],
          },
        },
      },
    },

    // ── AVOIRS ────────────────────────────────────
    {
      resource: Avoir,
      options: {
        navigation: { name: 'Facturation', icon: 'FileText' },
        listProperties: ['id', 'montant', 'motif', 'statut', 'dateCreation', 'clientId'],
        filterProperties: ['statut', 'clientId'],
        editProperties: ['motif', 'statut', 'montant'],
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
        },
        properties: {
          statut: {
            availableValues: [
              { value: 'en_cours_de_remboursement', label: 'En cours' },
              { value: 'rembourse', label: 'Remboursé' },
              { value: 'annule', label: 'Annulé' },
            ],
          },
        },
      },
    },

    // ── PANIERS ───────────────────────────────────
    {
      resource: Panier,
      options: {
        navigation: { name: 'Commandes', icon: 'ShoppingCart' },
        listProperties: ['id', 'clientId', 'statutCommande', 'prixTotal', 'createdAt'],
        filterProperties: ['statutCommande', 'clientId'],
        actions: {
          new: { isAccessible: false },
          delete: { isAccessible: false },
          edit: { isAccessible: false },
        },
      },
    },

    // ── CARROUSEL ─────────────────────────────────
    {
      resource: Carrousel,
      options: {
        navigation: { name: 'Contenus', icon: 'Photo' },
        listProperties: ['id', 'name', 'active', 'createdAt'],
        editProperties: ['name', 'active'],
        actions: {
          delete: {
            guard: 'Confirmer la suppression du carrousel ?',
          },
        },
      },
    },

    {
      resource: CarrouselItem,
      options: {
        navigation: { name: 'Contenus', icon: 'Photo' },
        listProperties: ['id', 'carrouselId', 'title', 'subtitle', 'order'],
        editProperties: ['carrouselId', 'imageId', 'title', 'subtitle', 'order'],
        actions: {
          delete: {
            guard: 'Confirmer la suppression de cet élément ?',
          },
        },
      },
    },
  ],

  branding: {
    companyName: 'Althéa Systems — Back Office',
    logo: false,
    favicon: '',
  },

  rootPath: '/admin',
});
