import 'dotenv/config';
import express from 'express';
import session, { MemoryStore } from 'express-session';
import AdminJSExpress from '@adminjs/express';

import { sequelize } from './db/connection.js';
import { admin } from './admin/index.js';
import { uploadRoutes } from './upload-routes.js';

const app = express();
const PORT = Number(process.env.ADMIN_PORT ?? 3001);
const SECRET = process.env.SESSION_SECRET ?? 'change-me';
const COOKIE_NAME = 'adminjs-session';
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:3001';

// Store partagé entre la session app-level (utilisée par /admin/sso) et la
// session interne du router AdminJS — sinon les deux middlewares ont chacun
// leur MemoryStore et l'adminUser posé par le SSO n'est jamais lu par AdminJS.
const sessionStore = new MemoryStore();

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
};

app.use(
  session({
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: SECRET,
    name: COOKIE_NAME,
    cookie: cookieOpts,
  })
);

// ─── SSO depuis le front Better Auth ─────────────────────────────────────────
// Le front passe son session token (cookie Better Auth) en query param.
// On le valide côté auth-service via le plugin bearer, on vérifie le rôle,
// et on hydrate la session AdminJS pour court-circuiter le form de login.
app.get('/admin/sso', async (req, res) => {
  const token = String(req.query.token ?? '');
  const fail = (status: number, msg: string) =>
    res
      .status(status)
      .send(
        `${msg} <a href="/admin/login" style="color:#2563eb">Retour à la connexion</a>`
      );

  if (!token) return fail(400, 'Token manquant.');

  try {
    const r = await fetch(`${AUTH_SERVICE_URL}/api/auth/get-session`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!r.ok) return fail(401, 'Session invalide ou expirée.');

    const data = (await r.json()) as { user?: { email?: string; role?: string; isActive?: boolean; id?: string } };
    const user = data?.user;

    if (!user || user.role !== 'admin' || user.isActive === false) {
      return fail(403, 'Accès refusé : compte non administrateur.');
    }

    req.session.adminUser = {
      email: user.email,
      role: user.role,
      id: user.id,
    };
    req.session.save((err) => {
      if (err) {
        console.error('[SSO] session.save', err);
        return fail(500, 'Erreur de session.');
      }
      res.redirect(admin.options.rootPath);
    });
  } catch (err) {
    console.error('[SSO]', err);
    fail(500, 'Erreur d\'authentification.');
  }
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  admin,
  {
    authenticate: async (email, password) => {
      // Fallback statique pour ouvrir le back office sans passer par le SSO
      // (utile en debug si l'auth-service est down).
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        return { email };
      }
      return null;
    },
    cookieName: COOKIE_NAME,
    cookiePassword: SECRET,
  },
  null,
  {
    store: sessionStore,
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieOpts,
  }
);

app.use(admin.options.rootPath, adminRouter);
app.use('/uploads', uploadRoutes);

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion PostgreSQL OK');

    if (process.env.NODE_ENV === 'development') {
      await admin.watch();
    }

    app.listen(PORT, () => {
      console.log(`Back office disponible sur http://localhost:${PORT}/admin`);
      console.log(`SSO endpoint : http://localhost:${PORT}/admin/sso?token=...`);
      console.log(`Gestionnaire d'images : http://localhost:${PORT}/uploads`);
    });
  } catch (err) {
    console.error('Erreur au démarrage :', err);
    process.exit(1);
  }
};

start();
