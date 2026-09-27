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
      {
        label: '2026',
        children: [
          {
            label: 'Setembro',
            children: [
              { label: 'RAG: Fundamentos', href: '/blog/rag-fundamentos' },
              { label: 'BMAD-METHOD', href: '/blog/bmad-method' },
              { label: 'HIVE: Multi-Agent', href: '/blog/hive-multi-agent' },
              { label: 'HYBRID-FLOW', href: '/blog/hybrid-flow' },
              { label: 'Memória em Agentes', href: '/blog/memoria-agentes' },
            ],
          },
          {
            label: 'Outubro',
            children: [
              { label: 'Avaliação & LLM-as-Judge', href: '/blog/avaliacao-llm' },
              { label: 'Guia Prático: RAG + LangChain', href: '/blog/guia-rag-langchain' },
              { label: 'RAG vs Long Context', href: '/blog/rag-vs-long-context' },
              { label: 'Tendências 2026', href: '/blog/tendencias-ia-2026' },
              { label: 'Troubleshooting', href: '/blog/troubleshooting-sistemas-ia' },
            ],
          },
        ],
      },
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

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const uniqueKey = `${item.label}-${depth}`;

    if (item.children) {
      return (
        <div key={uniqueKey} className={styles.navItem} style={{ marginLeft: `${depth * 12}px` }}>
          <button
            className={`${styles.navLink} ${isActive(item.href || '') ? styles.active : ''}`}
            onClick={() => toggleExpand(uniqueKey)}
          >
            <span>{item.label}</span>
            <span
              className={`${styles.chevron} ${
                expandedItems.includes(uniqueKey) ? styles.expanded : ''
              }`}
            >
              ›
            </span>
          </button>
          {expandedItems.includes(uniqueKey) && (
            <div className={styles.submenu}>
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={uniqueKey}
        to={item.href || ''}
        className={`${styles.submenuLink} ${isActive(item.href || '') ? styles.active : ''}`}
        style={{ marginLeft: `${depth * 12}px` }}
      >
        {item.label}
      </Link>
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
        {navItems.map((item) => renderNavItem(item, 0))}
      </nav>
    </aside>
  );
}
