import path from 'path';
import { fileURLToPath } from 'url';

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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const componentLoader = new ComponentLoader();
// Composant React minimal qui redirige vers /uploads. C'est la seule
// façon raisonnable d'avoir une entrée de sidebar AdminJS qui ouvre une
// route Express externe — un `pages` AdminJS doit obligatoirement avoir
// un composant pour s'afficher dans la nav.
const RedirectToUploads = componentLoader.add(
  'RedirectToUploads',
  path.join(__dirname, 'components/RedirectToUploads'),
);

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
          // Bouton "Téléverser l'image" sur chaque produit — redirige vers
          // le gestionnaire d'images Express (en dehors d'AdminJS) qui gère le
          // multipart + MinIO. AdminJS ne gère pas le file upload nativement
          // sans composant React custom, donc on délègue.
          uploadImage: {
            actionType: 'record',
            icon: 'Upload',
            label: 'Téléverser une image',
            guard: 'Vous allez être redirigé vers le gestionnaire d\'images.',
            component: false,
            handler: async (_request, _response, context) => {
              const id = context.record?.params.id;
              return {
                record: context.record?.toJSON(context.currentAdmin),
                redirectUrl: id ? `/uploads?focus=product:${id}` : '/uploads',
                notice: { message: 'Ouverture du gestionnaire d\'images', type: 'success' },
              };
            },
          },
        },
        properties: {
          linkPix: {
            description:
              'URL publique de l\'image. Cliquez sur « Téléverser une image » dans les actions du produit pour ouvrir le gestionnaire.',
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
              { value: 'remboursee', label: '🟣 Remboursée' },
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
              { value: 'remboursee', label: 'Remboursée' },
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
          // Même pattern que pour Product — bouton qui pointe vers /uploads.
          uploadImage: {
            actionType: 'record',
            icon: 'Upload',
            label: 'Téléverser une image',
            guard: 'Vous allez être redirigé vers le gestionnaire d\'images.',
            component: false,
            handler: async (_request, _response, context) => {
              const id = context.record?.params.id;
              return {
                record: context.record?.toJSON(context.currentAdmin),
                redirectUrl: id ? `/uploads?focus=carrousel:${id}` : '/uploads',
                notice: { message: 'Ouverture du gestionnaire d\'images', type: 'success' },
              };
            },
          },
        },
        properties: {
          imageId: {
            description:
              'URL publique de l\'image (colonne image_url). Cliquez sur « Téléverser une image » dans les actions de la diapositive pour ouvrir le gestionnaire.',
          },
        },
      },
    },
  ],

  pages: {
    'Gestionnaire d\'images': {
      icon: 'Upload',
      component: RedirectToUploads,
    },
  },

  branding: {
    companyName: 'Althea Systems — Back Office',
    logo: false,
    favicon: '',
  },

  rootPath: '/admin',
});
