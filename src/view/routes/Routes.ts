export const ROUTES = {
  home: '/',
  coupons: '/coupons',
  dashboard: '/dashboard',
  sales: '/sales',
  users: {
    home: '/users',
    blocked: {
      home: '/blocked-users',
      details: {
        path: '/blocked-users/:id',
        call: (id: string) => `/blocked-users/${id}`,
      },
    },
  },
  settings: '/settings',
};
