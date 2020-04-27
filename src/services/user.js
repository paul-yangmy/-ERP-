import request from '@/utils/request';
import { myRequest } from '@/utils/request';


export async function query(params) {
  return request('/currentUser/findByGroup', {
    params: { uGroup: params },
  });
}
export async function queryCurrent(params) {
  return request('/currentUser/getCurrentUser',{
    params:{uName:params},
  });
}
export async function userDelete(params) {
  return request('/currentUser/DeleteUser',{
    params: { uId: params },
  });
}

export async function changePwd(params) {
  return request('/currentUser/UpdatePwd',{
    method:'POST',
    data:params,
  });
}

export async function updateInfo(params) {
  return request('/currentUser/UpdateUser', {
    method: 'POST',
    data: params,
  });
}

export async function CreateUser(params) {
  return request('/currentUser/CreateUser', {
    method: 'POST',
    data: params,
  });
}
