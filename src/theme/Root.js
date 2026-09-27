import React from 'react';
import { useLocation } from '@docusaurus/router';
import SiteSidebar from '@site/src/components/SiteSidebar';

export default function Root({ children }) {
  const location = useLocation();
  const basePath = '/about';
  const isDocsRoute = location.pathname.startsWith(basePath + '/docs');

  return (
    <>
      {!isDocsRoute && <SiteSidebar />}
      {children}
    </>
  );
}
