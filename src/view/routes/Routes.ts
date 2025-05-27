export const ROUTES = {
  home: '/',
  login: '/login',
  setPassword: '/set-password',
  coupons: '/coupons',
  dashboard: '/dashboard',
  userManagement: '/user-management',
  sales: {
    home: '/sales',
    details: {
      path: '/sales/:depositId',
      call: (id: string) => `/sales/${id}`,
    },
  },
  users: {
    home: '/users',
    details: {
      path: '/users/:id',
      call: (id: string) => `/users/${id}`,
    },
    blocked: {
      home: '/blocked-users',
      details: {
        path: '/blocked-users/:id',
        call: (id: string) => `/blocked-users/${id}`,
      },
    },
    vips: {
      home: '/vip-users',
      details: {
        path: '/vip-users/:id',
        call: (id: string) => `/vip-users/${id}`,
      },
    },
  },
  settings: '/settings',
};
