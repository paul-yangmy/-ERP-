import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import themePluginConfig from './themePluginConfig';
const { pwa } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: false,
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

if (isAntDesignProPreview) {
  // 针对 preview.pro.ant.design 的 GA 统计代码
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
  plugins.push(['umi-plugin-antd-theme', themePluginConfig]);
}

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/SecurityLayout',
          routes: [
            {
              path: '/',
              component: '../layouts/BasicLayout',
              Routes: ['src/pages/Authorized'],
              authority: ['admin', 'user'],
              routes: [
                {
                  path: '/home',
                  name: '首页',
                  icon: 'home',
                  component: './home',
                },
                {
                  path: '/item',
                  name: '商品',
                  icon: 'shopping',
                  routes: [
                    {
                      name: '商品档案',
                      icon: 'table',
                      path: '/item/commodity',
                      component: './item/commodity',
                    },
                    {
                      name: '检测报告',
                      icon: 'profile',
                      path: '/item/Test_Report',
                      component: './item/Test_Report',
                    },
                  ],
                },
                {
                  path: '/indent',
                  name: '订单',
                  icon: 'gift',
                  component: './indent',
                },
                {
                  path: '/purchase',
                  name: '采购',
                  icon: 'shopping-cart',
                  component: './purchase',
                },
                {
                  path: '/storeroom',
                  name: '库房',
                  icon: 'inbox',
                  routes: [
                    {
                      name: '库存报告',
                      icon: 'file-done',
                      path: '/storeroom/on_hand',
                      component: './storeroom/on_hand',
                    },
                    {
                      name: '入库',
                      icon: 'import',
                      path: '/storeroom/input',
                      component: './storeroom/input',
                    },
                    {
                      name: '出库',
                      icon: 'export',
                      path: '/storeroom/output',
                      component: './storeroom/output',
                    },
                  ],
                },
                {
                  path: '/dispatch',
                  name: '配送',
                  icon: 'dashboard',
                  routes: [
                    {
                      name: '地图',
                      icon: 'compass',
                      path: '/dispatch/map',
                      component: './dispatch/map',
                    },
                    {
                      name: '司机管理',
                      icon: 'branches',
                      path: '/dispatch/driver',
                      component: './dispatch/driver',
                    },
                  ],
                },
                {
                  path: '/revenue',
                  name: '财务报表',
                  icon: 'account-book',
                  routes: [
                    {
                      name: '财务单',
                      icon: 'container',
                      path: '/revenue/finance',
                      component: './revenue/finance',
                    },
                    {
                      name: '分析',
                      icon: 'line-chart',
                      path: '/revenue/analysis',
                      component: './revenue/analysis',
                    },
                  ],
                }, // {
                //   path: '/profile',
                //   name: 'profile',
                //   icon: 'profile',
                //   routes: [
                //     {
                //       name: 'basic',
                //       icon: 'smile',
                //       path: '/profile/basic',
                //       component: './profile/basic',
                //     },
                //     {
                //       name: 'advanced',
                //       icon: 'smile',
                //       path: '/profile/advanced',
                //       component: './profile/advanced',
                //     },
                //   ],
                // },
                {
                  name: '个人设置',
                  icon: 'user',
                  path: '/settings',
                  component: './settings',
                },
                {
                  path: '/',
                  redirect: '/home',
                  authority: ['admin', 'user'],
                },
                {
                  component: '404',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less') ||
        context.resourcePath.includes('.css') //解决CSS文件加载失败的问题
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  // chainWebpack: webpackPlugin,
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  proxy: {
    '/currentUser/': {
      target: 'http://106.13.214.108:8080/userController',
      changeOrigin: true,
      pathRewrite: {
        '^/currentUser': '',
      },
    },
    '/graph/': {
      target: 'http://106.13.214.108:8080/uploadGraph',
      changeOrigin: true,
      pathRewrite: {
        '^/graph': '',
      },
    },
    '/commodity/': {
      target: 'http://106.13.214.108:8080/table/Commodity',
      changeOrigin: true,
      pathRewrite: {
        '^/commodity': '',
      },
    },
    '/testReport/': {
      target: 'http://106.13.214.108:8080/table/TestReport',
      changeOrigin: true,
      pathRewrite: {
        '^/testReport': '',
      },
    },
    '/indent/': {
      target: 'http://106.13.214.108:8080/indent',
      changeOrigin: true,
      pathRewrite: {
        '^/indent': '',
      },
    },
    '/buy/': {
      target: 'http://106.13.214.108:8080/buy',
      changeOrigin: true,
      pathRewrite: {
        '^/buy': '',
      },
    },
    '/repo/': {
      target: 'http://106.13.214.108:8080/repo',
      changeOrigin: true,
      pathRewrite: {
        '^/repo': '',
      },
    },
    '/delivery/': {
      target: 'http://106.13.214.108:8080/delivery',
      changeOrigin: true,
      pathRewrite: {
        '^/delivery': '',
      },
    },
    '/finance/': {
      target: 'http://106.13.214.108:8080/finance',
      changeOrigin: true,
      pathRewrite: {
        '^/finance': '',
      },
    },
  },
};

