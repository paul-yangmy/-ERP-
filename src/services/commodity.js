import request from '@/utils/request';

export async function queryCommodity() {
  return request('/commodity/findAllCommodity');
}

export async function queryCommodityByID(params) {
  return request('/commodity/findByItemId',{
    params: { itemId: params },
  });
}

export async function deleteCommodity(params) {
  return request('/commodity/DeleteCommodity', {
    params: { itemId: params },
  });
}
export async function updateCommodity(params) {
  return request('/commodity/UpdateCommodity', {
    method: 'POST',
    data: params,
  });
}
export async function updateCommodityState(params) {
  return request('/commodity/UpdateCommodityStatus', {
    method: 'POST',
    data: params,
  });
}
export async function createCommodity(params) {
  return request('/commodity/CreateCommodity', {
    method: 'POST',
    data: params,
  });
}

