/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import { Icon, Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
//import { isAntDesignPro, getAuthorityFromRouter } from '@/utils/utils';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="222016321102038 杨明宇"
    links={[
      {
        key: 'github',
        title: <Icon type="github" />,
        href: 'https://github.com/paul-yangmy/Graduation-Project',
        blankTarget: true,
      },
      {
        key: 'paul',
        title: 'Paul_yangmy',
        href: 'https://github.com/paul-yangmy/Graduation-Project',
        blankTarget: true,
      },
    ]}
  />
);

const footerRender = () => {
  // if (!isAntDesignPro()) {
  //   return defaultFooterDom;
  // }

  return (
    <>
      {defaultFooterDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
      </div>
    </>
  );
};

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */
  // console.log(props)
  // const tasParams = {
  //   ...this.props.routerData[location.pathname],
  //   keys: location.pathname,
  //   location,
  //   dispatch: this.props.dispatch,
  //   match,
  // }
  useEffect(() => {

    dispatch({
      type: 'user/fetchCurrent',
      payload: localStorage.getItem('user'),
    });
  }, []);
  /*
  //每次render(包括第一次render和之后的每次update)之后需要做一些事情
  useEffect(()=>{
  part A
  return part B;
  });  //Part A是写在componentDidMount和componentDidUpdate的代码，part B是写在componentWillUnMount的代码
  //只执行一次
  useEffect(()=>{
  part A
  return part B;
  }, []);//只在componentDidMount和componentWillUnMount时执行代码
  //第二个参数[]表示useEffect里面的part A和part B不依赖任何props, state, 因此不需要再次render
  //part A, part B里涉及到的props和state始终是初始值，不会被更新。
  //如果第二个参数传[ list ]，表示useEffect会在list发生改变时执行。也就是在componentDidMount，componentDidUpdate( 检测到list更新之后)和componentWillUnMount时执行。
  */

  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  return (
    <>
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/">
            {logoDom}
            {titleDom}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/',
            breadcrumbName: '🏠',
          },
          ...routers,
        ]}
        itemRender={(route, params, routes, paths) => {
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
              <span>{route.breadcrumbName}</span>
            );
        }}
        footerRender={footerRender}
        menuDataRender={menuDataRender}
        formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      <SettingDrawer
        settings={settings}
        onSettingChange={config =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      />
    </>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
