import React, { useEffect, useState } from 'react';
import { H2, H5, Text } from '@adminjs/design-system';
import { ApiClient, useCurrentAdmin } from 'adminjs';

const StatCard = ({ label, value, href }) => {
  const body = (
    <div
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '20px 24px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Text fontSize="sm" color="grey60">
        {label}
      </Text>
      <div
        style={{
          marginTop: 8,
          fontSize: 28,
          fontWeight: 600,
          color: '#111827',
          lineHeight: 1.1,
        }}
      >
        {value ?? '—'}
      </div>
    </div>
  );
  return href ? (
    <a href={href} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      {body}
    </a>
  ) : (
    body
  );
};

const ShortcutLink = ({ title, href }) => (
  <a
    href={href}
    style={{
      display: 'block',
      padding: '14px 0',
      borderBottom: '1px solid #f1f2f5',
      color: '#111827',
      textDecoration: 'none',
      fontSize: 15,
    }}
  >
    {title}
    <span style={{ float: 'right', color: '#9ca3af' }}>›</span>
  </a>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [currentAdmin] = useCurrentAdmin();

  useEffect(() => {
    const api = new ApiClient();
    api
      .getDashboard()
      .then(({ data }) => setStats(data || {}))
      .catch(() => setStats({}));
  }, []);

  const greetingName =
    currentAdmin?.firstName ||
    (currentAdmin?.email ? currentAdmin.email.split('@')[0] : null) ||
    'Administrateur';

  return (
    <div style={{ padding: '48px 48px', maxWidth: 1080 }}>
      <Text fontSize="sm" color="grey60" style={{ letterSpacing: 0.5 }}>
        Althea Systems — Back Office
      </Text>
      <H2 mt="sm" mb="xl" style={{ color: '#111827', fontWeight: 600 }}>
        Bonjour {greetingName}
      </H2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 12,
          marginBottom: 48,
        }}
      >
        <StatCard label="Produits actifs" value={stats?.productsActive} href="/admin/resources/products" />
        <StatCard label="Commandes en attente" value={stats?.ordersPending} href="/admin/resources/orders" />
        <StatCard label="Factures impayées" value={stats?.facturesUnpaid} href="/admin/resources/factures" />
        <StatCard label="Avoirs en cours" value={stats?.avoirsPending} href="/admin/resources/avoirs" />
      </div>

      <H5 mb="default" style={{ color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 12 }}>
        Accès rapide
      </H5>
      <div>
        <ShortcutLink title="Nouveau produit" href="/admin/resources/products/actions/new" />
        <ShortcutLink title="Commandes à traiter" href="/admin/resources/orders" />
        <ShortcutLink title="Gestionnaire d'images" href="/uploads" />
        <ShortcutLink title="Carrousel d'accueil" href="/admin/resources/carrousel_items" />
      </div>
    </div>
  );
};

export default Dashboard;
