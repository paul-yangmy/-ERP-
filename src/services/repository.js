import request from '@/utils/request';

export async function queryRepository() {
    return request('/repo/Repository/findAllRepository');
}
export async function queryByDate(params) {
    return request('/repo/Repository/findByDate', {
        params: { date: params },
    });
}
export async function queryOutStorage() {
    return request('/repo/OutStorage/findAllOutStorage');
}
export async function updateOutStorage(params) {
    return request('/repo/OutStorage/UpdateOutStorage', {
        method: 'POST',
        data: params,
    });
}
export async function updateOutStorageState(params) {
    return request('/repo/OutStorage/UpdateOutStorageStatus', {
        method: 'POST',
        data: params,
    });
}
export async function queryInStorage() {
    return request('/repo/InStorage/findAllInStorage');
}
export async function updateInStorage(params) {
    return request('/repo/InStorage/UpdateInStorage', {
        method: 'POST',
        data: params,
    });
}
export async function updateInStorageState(params) {
    return request('/repo/InStorage/UpdateInStorageStatus', {
        method: 'POST',
        data: params,
    });
}