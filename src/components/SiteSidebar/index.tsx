import React, { useMemo } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Blog', href: '/blog', icon: '📝' },
  { label: 'Projetos', href: '/projetos', icon: '🚀' },
  { label: 'Sobre', href: '/sobre', icon: '👤' },
  { label: 'Docs', href: '/docs/intro', icon: '📚' },
];

export default function SiteSidebar() {
  const location = useLocation();
  const basePath = '/about';

  const isActive = useMemo(() => {
    return (path: string) => {
      const currentPath = location.pathname.replace(basePath, '') || '/';
      if (path === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(path);
    };
  }, [location.pathname]);

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
          >
            {item.icon && <span className={styles.icon}>{item.icon}</span>}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
