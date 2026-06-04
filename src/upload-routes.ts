import express, { type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';

import { Product, CarrouselItem, Carrousel } from './db/models/index.js';
import { isAllowedImage, uploadBuffer, tryDeleteByUrl } from './storage/minio.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
});

export const uploadRoutes = express.Router();

// ── Auth ─────────────────────────────────────────────────────────────────────
// Réutilise la session déjà posée par AdminJS / le SSO. Tout user dont
// req.session.adminUser est présent est considéré admin.
uploadRoutes.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.adminUser) {
    return res.redirect('/admin/login');
  }
  next();
});

// ── Helpers de rendu ─────────────────────────────────────────────────────────
const layout = (title: string, body: string, flash?: { ok?: string; err?: string }) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { color-scheme: light; }
    body { font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif; margin: 0; background: #f6f7f9; color: #111; }
    .topbar { background: #1f2937; color: #fff; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; }
    .topbar a { color: #fff; text-decoration: none; opacity: .8; }
    .topbar a:hover { opacity: 1; }
    .container { max-width: 1100px; margin: 24px auto; padding: 0 24px; }
    h1 { margin: 0 0 8px; font-size: 22px; }
    h2 { margin: 32px 0 12px; font-size: 18px; color: #334155; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
    .card h3 { margin: 0 0 4px; font-size: 14px; }
    .meta { font-size: 12px; color: #6b7280; margin-bottom: 12px; }
    .preview { width: 100%; aspect-ratio: 4/3; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 12px; color: #94a3b8; font-size: 12px; }
    .preview img { width: 100%; height: 100%; object-fit: cover; }
    form { display: flex; flex-direction: column; gap: 8px; }
    input[type=file] { font-size: 13px; }
    button { padding: 8px 12px; border: 0; border-radius: 6px; cursor: pointer; font-size: 13px; }
    .btn-primary { background: #2563eb; color: #fff; }
    .btn-danger { background: transparent; color: #b91c1c; border: 1px solid #fca5a5; }
    .row { display: flex; gap: 8px; }
    .flash { padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px; }
    .flash.ok { background: #ecfdf5; color: #065f46; border: 1px solid #6ee7b7; }
    .flash.err { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
  </style>
</head>
<body>
  <div class="topbar">
    <strong>Althea — Gestionnaire d'images</strong>
    <span><a href="/admin">← Retour au back office</a></span>
  </div>
  <div class="container">
    <h1>${title}</h1>
    ${flash?.ok ? `<div class="flash ok">${flash.ok}</div>` : ''}
    ${flash?.err ? `<div class="flash err">${flash.err}</div>` : ''}
    ${body}
  </div>
</body>
</html>
`;

const esc = (s: string | null | undefined) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

const productCard = (p: { id: number; names: string | null; linkPix: string | null }) => `
  <div id="product-${p.id}" class="card">
    <h3>${esc(p.names) || 'Produit sans nom'}</h3>
    <div class="meta">#${p.id}</div>
    <div class="preview">${p.linkPix ? `<img src="${esc(p.linkPix)}" alt="" />` : 'Aucune image'}</div>
    <form action="/uploads/product/${p.id}" method="post" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" required />
      <div class="row">
        <button type="submit" class="btn-primary">Téléverser</button>
        ${p.linkPix ? `<button type="submit" formaction="/uploads/product/${p.id}/remove" formmethod="post" formenctype="application/x-www-form-urlencoded" formnovalidate class="btn-danger">Retirer</button>` : ''}
      </div>
    </form>
  </div>
`;

const slideCard = (i: { id: number; title: string | null; subtitle: string | null; imageId: string | null; carrouselName: string | null }) => `
  <div id="carrousel-${i.id}" class="card">
    <h3>${esc(i.title) || 'Diapositive sans titre'}</h3>
    <div class="meta">#${i.id}${i.carrouselName ? ` · ${esc(i.carrouselName)}` : ''}</div>
    <div class="preview">${i.imageId ? `<img src="${esc(i.imageId)}" alt="" />` : 'Aucune image'}</div>
    <form action="/uploads/carrousel/${i.id}" method="post" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/png,image/jpeg,image/webp,image/gif" required />
      <div class="row">
        <button type="submit" class="btn-primary">Téléverser</button>
        ${i.imageId?.startsWith('http') ? `<button type="submit" formaction="/uploads/carrousel/${i.id}/remove" formmethod="post" formenctype="application/x-www-form-urlencoded" formnovalidate class="btn-danger">Retirer</button>` : ''}
      </div>
    </form>
  </div>
`;

const focusScript = `
<script>
(function () {
  const params = new URLSearchParams(window.location.search);
  const focus = params.get('focus'); // ex. "product:5" ou "carrousel:2"
  if (!focus) return;
  const [type, id] = focus.split(':');
  if (!type || !id) return;
  const target = document.getElementById(type + '-' + id);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.style.outline = '3px solid #2563eb';
  target.style.boxShadow = '0 0 0 6px rgba(37, 99, 235, 0.15)';
  setTimeout(() => {
    target.style.outline = '';
    target.style.boxShadow = '';
  }, 2500);
})();
</script>
`;

// ── Pages ────────────────────────────────────────────────────────────────────
uploadRoutes.get('/', async (req, res) => {
  const flash = {
    ok: typeof req.query.ok === 'string' ? req.query.ok : undefined,
    err: typeof req.query.err === 'string' ? req.query.err : undefined,
  };

  const products = await Product.findAll({ order: [['id', 'ASC']] });
  const items = await CarrouselItem.findAll({ order: [['carrouselId', 'ASC'], ['order', 'ASC']] });
  const carrousels = await Carrousel.findAll();
  const cMap = new Map(carrousels.map((c) => [c.get('id') as number, c.get('name') as string | null]));

  const body = `
    <p style="color:#475569;font-size:14px;margin:0 0 24px">
      Téléversez des images pour vos produits et vos diapositives de carrousel.
      Les images sont stockées sur MinIO et leur URL publique est sauvegardée en base.
    </p>

    <h2>Produits (${products.length})</h2>
    <div class="grid">
      ${products
        .map((p) =>
          productCard({
            id: p.get('id') as number,
            names: p.get('names') as string | null,
            linkPix: p.get('linkPix') as string | null,
          })
        )
        .join('')}
    </div>

    <h2>Diapositives du carrousel (${items.length})</h2>
    <div class="grid">
      ${items
        .map((i) =>
          slideCard({
            id: i.get('id') as number,
            title: i.get('title') as string | null,
            subtitle: i.get('subtitle') as string | null,
            imageId: i.get('imageId') as string | null,
            carrouselName: cMap.get(i.get('carrouselId') as number) ?? null,
          })
        )
        .join('')}
    </div>

    ${focusScript}
  `;

  res.send(layout('Gestionnaire d’images', body, flash));
});

// ── Handlers de POST ─────────────────────────────────────────────────────────
const redirectWith = (res: Response, params: { ok?: string; err?: string }) => {
  const q = new URLSearchParams();
  if (params.ok) q.set('ok', params.ok);
  if (params.err) q.set('err', params.err);
  res.redirect(`/uploads?${q.toString()}`);
};

uploadRoutes.post('/product/:id', upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  const file = req.file;
  if (!file) return redirectWith(res, { err: 'Aucun fichier reçu.' });
  if (!isAllowedImage(file.mimetype)) {
    return redirectWith(res, { err: `Format non supporté (${file.mimetype}).` });
  }
  const product = await Product.findByPk(id);
  if (!product) return redirectWith(res, { err: 'Produit introuvable.' });

  try {
    const previous = product.get('linkPix') as string | null;
    const { url } = await uploadBuffer(`products/${id}`, file.buffer, file.mimetype);
    await product.update({ linkPix: url });
    await tryDeleteByUrl(previous);
    redirectWith(res, { ok: `Image du produit #${id} mise à jour.` });
  } catch (err) {
    console.error('[uploads] product', err);
    redirectWith(res, { err: 'Échec du téléversement.' });
  }
});

uploadRoutes.post('/product/:id/remove', async (req, res) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);
  if (!product) return redirectWith(res, { err: 'Produit introuvable.' });
  const previous = product.get('linkPix') as string | null;
  await product.update({ linkPix: null });
  await tryDeleteByUrl(previous);
  redirectWith(res, { ok: `Image du produit #${id} retirée.` });
});

uploadRoutes.post('/carrousel/:id', upload.single('image'), async (req, res) => {
  const id = Number(req.params.id);
  const file = req.file;
  if (!file) return redirectWith(res, { err: 'Aucun fichier reçu.' });
  if (!isAllowedImage(file.mimetype)) {
    return redirectWith(res, { err: `Format non supporté (${file.mimetype}).` });
  }
  const item = await CarrouselItem.findByPk(id);
  if (!item) return redirectWith(res, { err: 'Diapositive introuvable.' });

  try {
    const previous = item.get('imageId') as string | null;
    const { url } = await uploadBuffer(`carrousel/${id}`, file.buffer, file.mimetype);
    await item.update({ imageId: url });
    if (previous?.startsWith('http')) await tryDeleteByUrl(previous);
    redirectWith(res, { ok: `Image de la diapositive #${id} mise à jour.` });
  } catch (err) {
    console.error('[uploads] carrousel', err);
    redirectWith(res, { err: 'Échec du téléversement.' });
  }
});

uploadRoutes.post('/carrousel/:id/remove', async (req, res) => {
  const id = Number(req.params.id);
  const item = await CarrouselItem.findByPk(id);
  if (!item) return redirectWith(res, { err: 'Diapositive introuvable.' });
  const previous = item.get('imageId') as string | null;
  // image_url est NOT NULL en base — on remet une chaîne vide plutôt que null.
  await item.update({ imageId: '' });
  if (previous?.startsWith('http')) await tryDeleteByUrl(previous);
  redirectWith(res, { ok: `Image de la diapositive #${id} retirée.` });
});
