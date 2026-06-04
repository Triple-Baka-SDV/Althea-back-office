import 'express-session';

declare module 'express-session' {
  interface SessionData {
    adminUser?: { email?: string; role?: string; id?: string };
  }
}
