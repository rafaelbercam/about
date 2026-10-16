import React from 'react';
import CategoryOriginal from '@docusaurus/theme-classic/lib/theme/DocSidebarItem/Category';

export default function CategoryWrapper(props) {
  const { item, onItemClick, level, index } = props;
  const icon = item.customProps?.icon;

  return (
    <div className={`doc-sidebar-category-wrapper`}>
      {icon && <span className="material-symbols-rounded sidebar-icon">{icon}</span>}
      <CategoryOriginal {...props} />
    </div>
  );
}
