import React from 'react';
import GlobalSidebar from '@site/src/components/GlobalSidebar';

export default function Root({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <GlobalSidebar />
      <div style={{ flex: 1, marginLeft: '320px' }}>
        {children}
      </div>
      <style>
        {`
          @media (max-width: 996px) {
            body {
              margin-left: 0 !important;
            }
            div[style*="margin-left: 320px"] {
              margin-left: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}
