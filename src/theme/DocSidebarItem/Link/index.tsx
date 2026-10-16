import React from 'react';
import LinkOriginal from '@docusaurus/theme-classic/lib/theme/DocSidebarItem/Link';

export default function LinkWrapper(props) {
  const { item } = props;
  const icon = item.customProps?.icon;

  return (
    <div className="doc-sidebar-link-wrapper">
      {icon && <span className="material-symbols-rounded sidebar-icon">{icon}</span>}
      <LinkOriginal {...props} />
    </div>
  );
}
