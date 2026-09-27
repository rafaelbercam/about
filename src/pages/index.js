import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.href = '/about/docs/intro';
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <p>Redirecionando...</p>
    </div>
  );
}
