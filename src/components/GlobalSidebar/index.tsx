import React, { useState } from 'react';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Blog',
    href: '/blog',
    children: [
      { label: 'RAG: Fundamentos', href: '/blog/rag-fundamentos' },
      { label: 'BMAD-METHOD', href: '/blog/bmad-method' },
      { label: 'HIVE: Multi-Agent', href: '/blog/hive-multi-agent' },
      { label: 'HYBRID-FLOW', href: '/blog/hybrid-flow' },
      { label: 'Memória em Agentes', href: '/blog/memoria-agentes' },
      { label: 'Avaliação & LLM-as-Judge', href: '/blog/avaliacao-llm' },
    ],
  },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Sobre', href: '/sobre' },
];

export default function GlobalSidebar() {
  const location = useLocation();
  const basePath = '/about';
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const isActive = (path: string) => {
    const currentPath = location.pathname.replace(basePath, '') || '/';
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <Link to="/" className={styles.logo}>
          Rafael Bercam
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <div key={item.label} className={styles.navItem}>
            {item.children ? (
              <>
                <button
                  className={`${styles.navLink} ${isActive(item.href || '') ? styles.active : ''}`}
                  onClick={() => toggleExpand(item.label)}
                >
                  <span>{item.label}</span>
                  <span
                    className={`${styles.chevron} ${
                      expandedItems.includes(item.label) ? styles.expanded : ''
                    }`}
                  >
                    ›
                  </span>
                </button>
                {expandedItems.includes(item.label) && (
                  <div className={styles.submenu}>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href || ''}
                        className={`${styles.submenuLink} ${isActive(child.href || '') ? styles.active : ''}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.href || ''}
                className={`${styles.navLink} ${isActive(item.href || '') ? styles.active : ''}`}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
