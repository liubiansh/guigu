// 对外暴露配置路由(常量路由)
export const constantRoute = [
  // 登录
  {
    path: '/login',
    // 路由懒加载
    component: () => import('../views/login/login.vue'),
    // 命名路由
    name: 'login',
    // 添加配置信息，用来展示路由内容
    meta: {
      title: '登录',
      // 代表路由标题在菜单中是否隐藏， true隐藏， false不隐藏
      hidden: true,
    },
  },
  // 登录成功后展示数据的路由
  {
    path: '/',
    component: () => import('@/layout/layout.vue'),
    name: 'layout',
    meta: {
      hidden: false,
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('../views/home/home.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
      },
    ],
  },
  // 404页面
  {
    path: '/404',
    component: () => import('../views/404/404.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
    },
  },
  // 任意页面
  // 当所有匹配都不成功时触发，使其重定向到404页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true,
    },
  },
  // 数据大屏
  {
    path: '/screen',
    component: () => import('@/views/screen/screen.vue'),
    name: 'screen',
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'Platform',
    },
  },
  // 权限管理
  {
    path: '/acl',
    component: () => import('@/layout/layout.vue'),
    name: 'Acl',
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock',
    },
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/user.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/role.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'User',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/menu/menu.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Monitor',
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/product',
    component: () => import('@/layout/layout.vue'),
    name: 'Product',
    redirect: '/product/trademark',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods',
    },
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/trademark/trademark.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/attr.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/spu.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/sku.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Orange',
        },
      },
    ],
  },
];
