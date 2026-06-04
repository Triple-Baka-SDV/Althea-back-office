import React, { useEffect } from 'react';

// AdminJS bundle ce composant et le rend quand l'utilisateur ouvre l'entrée
// "Gestionnaire d'images" dans la sidebar. On redirige immédiatement vers la
// vraie page Express /uploads (qui vit hors d'AdminJS).
const RedirectToUploads = () => {
  useEffect(() => {
    window.location.replace('/uploads');
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: '#475569' }}>
      Redirection vers le gestionnaire d&rsquo;images…{' '}
      <a href="/uploads" style={{ color: '#2563eb' }}>
        Cliquez ici si la page ne s&rsquo;ouvre pas
      </a>
      .
    </div>
  );
};

export default RedirectToUploads;
