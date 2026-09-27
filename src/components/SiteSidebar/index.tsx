import React, { useMemo, useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface NavItem {
  label: string;
  href?: string;
  icon?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  {
    label: 'Blog',
    href: '/blog',
    icon: '📝',
    children: [
      { label: 'RAG: Fundamentos', href: '/blog/rag-fundamentos' },
      { label: 'BMAD-METHOD', href: '/blog/bmad-method' },
      { label: 'HIVE: Multi-Agent', href: '/blog/hive-multi-agent' },
      { label: 'HYBRID-FLOW', href: '/blog/hybrid-flow' },
      { label: 'Memória em Agentes', href: '/blog/memoria-agentes' },
      { label: 'Avaliação & LLM-as-Judge', href: '/blog/avaliacao-llm' },
    ],
  },
  { label: 'Projetos', href: '/projetos', icon: '🚀' },
  { label: 'Sobre', href: '/sobre', icon: '👤' },
  { label: 'Docs', href: '/docs/intro', icon: '📚' },
];

export default function SiteSidebar() {
  const location = useLocation();
  const basePath = '/about';
  const [expandedItems, setExpandedItems] = useState<string[]>(['Blog']);

  const isActive = useMemo(() => {
    return (path: string) => {
      const currentPath = location.pathname.replace(basePath, '') || '/';
      if (path === '/') {
        return currentPath === '/';
      }
      return currentPath.startsWith(path);
    };
  }, [location.pathname]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <div key={item.label}>
            <div className={styles.navItemWrapper}>
              {item.children ? (
                <>
                  <button
                    className={`${styles.navItem} ${isActive(item.href || '') ? styles.active : ''} ${
                      styles.expandable
                    }`}
                    onClick={() => toggleExpand(item.label)}
                  >
                    {item.icon && <span className={styles.icon}>{item.icon}</span>}
                    <span>{item.label}</span>
                    <span
                      className={`${styles.chevron} ${
                        expandedItems.includes(item.label) ? styles.expanded : ''
                      }`}
                    >
                      ›
                    </span>
                  </button>
                  <Link
                    to={item.href || ''}
                    className={`${styles.navItemLink} ${isActive(item.href || '') ? styles.active : ''}`}
                  />
                </>
              ) : (
                <Link
                  to={item.href || ''}
                  className={`${styles.navItem} ${isActive(item.href || '') ? styles.active : ''}`}
                >
                  {item.icon && <span className={styles.icon}>{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              )}
            </div>

            {item.children && expandedItems.includes(item.label) && (
              <div className={styles.submenu}>
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    to={child.href || ''}
                    className={`${styles.submenuItem} ${isActive(child.href || '') ? styles.active : ''}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
