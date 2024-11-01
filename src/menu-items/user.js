// assets
import { IconUsers, IconStars } from '@tabler/icons-react';

// constant
const icons = { IconUsers, IconStars };

const user = {
  id: 'sample-docs-roadmap',
  title: 'Khác',
  type: 'group',
  children: [
    {
      id: 'sample-page',
      title: 'Khách hàng',
      type: 'item',
      url: 'user/qlkh',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'documentation',
      title: 'Đánh giá',
      type: 'item',
      url: 'user/qldanhgia',
      icon: icons.IconStars,
      external: false,
      target: false
    }
  ]
};

export default user;
