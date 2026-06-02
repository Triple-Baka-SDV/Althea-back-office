import 'dotenv/config';
import express from 'express';
import AdminJSExpress from '@adminjs/express';

import { sequelize } from './db/connection.js';
import { admin } from './admin/index.js';

const app = express();
const PORT = process.env.ADMIN_PORT ?? 3001;

// Authentification avec session cookie
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      // Simple vérification par variables d'environnement
      // Tu peux brancher ici ta vraie logique (requête DB, bcrypt, etc.)
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        return { email };
      }
      return null;
    },
    cookieName: 'adminjs-session',
    cookiePassword: process.env.SESSION_SECRET!,
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET!,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  }
);

app.use(admin.options.rootPath, adminRouter);

// Lancement
const start = async () => {
  try {
    // Vérifier la connexion DB sans modifier les tables
    await sequelize.authenticate();
    console.log('Connexion PostgreSQL OK');

    if (process.env.NODE_ENV === 'development') {
      await admin.watch(); // rebuild React en dev — obligatoire sinon page blanche
    }

    app.listen(PORT, () => {
      console.log(`Back office disponible sur http://localhost:${PORT}/admin`);
    });
  } catch (err) {
    console.error('Erreur au démarrage :', err);
    process.exit(1);
  }
};

start();
