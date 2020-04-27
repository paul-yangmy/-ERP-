import request from '@/utils/request';
export async function fakeAccountLogin(params) {
  // console.log(params.userName)
  return request('/currentUser/LoginUser', {
    method: 'POST',
    data: JSON.stringify(params),
    // data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
