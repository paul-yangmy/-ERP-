import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import moment from 'moment';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
  const authority = router.find(({ path }) => path && pathRegexp(path).exec(pathname));
  if (authority) return authority;
  return undefined;
};

export function formatRangeDate(rangeDate) {
  if (rangeDate) {
    let beginDate = '';
    let endDate = '';
    if (rangeDate[0]) {
      beginDate = moment(rangeDate[0]).format('YYYY-MM-DD 00:00:00');
    }
    if (rangeDate[1]) {
      endDate = moment(rangeDate[1]).format('YYYY-MM-DD 00:00:00');
    }

    return {
      beginDate,
      endDate,
    };
  }
  return {
    beginDate: '',
    endDate: '',
  };
}

export function formatDate(date) {
  if (date) {
    let pickDate = '';
    pickDate = moment(date).format('YYYY-MM-DD');

    return {
      pickDate
    };
  }
  return {
    pickDate:''
  };
}
