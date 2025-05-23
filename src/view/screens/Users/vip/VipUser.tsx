import { PageHeader } from '@/view/layout/Page/PageHeader';
import { useState } from 'react';

export function VipUsers() {
  const [collapsedHeader, setCollapsedHeader] = useState(false);

  const toggleHeader = () => {
    setCollapsedHeader(!collapsedHeader);
  };

  return (
    <div>
      <PageHeader
        title="Usuários VIPs"
        description="Gerencie todos os usuários VIPS no sistema."
        collapsed={collapsedHeader}
        toggle={toggleHeader}
      />
    </div>
  );
}
