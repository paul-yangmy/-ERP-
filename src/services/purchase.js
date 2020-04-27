import request from '@/utils/request';

export async function queryPurchase() {
    return request('/buy/findAllPurchase');
}

export async function queryOnDemandyPurchase() {
    return request('/buy/findAllOnDemandy');
}

export async function queryByBuyId() {
    return request('/buy/findByBuyId');
}

export async function queryDetailByBuyId(params) {
    return request('/buy/findByDetail', {
        params: { buyId: params },
    });
}

export async function deletePurchase(params) {
    return request('/buy/DeletePurchase', {
        params: { buyId: params },
    });
}
export async function updatePurchase(params) {
    return request('/buy/UpdatePurchase', {
        method: 'POST',
        data: params,
    });
}
export async function updatePurchaseState(params) {
    return request('/buy/UpdatePurchaseStatus', {
        method: 'POST',
        data: params,
    });
}
export async function createPurchase(params) {
    return request('/buy/CreatePurchase', {
        method: 'POST',
        data: params,
    });
}

