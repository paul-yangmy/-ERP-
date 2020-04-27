import request from '@/utils/request';

export async function queryTransportation() {
    return request('/delivery/Transportation/findAllTransportation');
}
export async function queryDriver() {
    return request('/delivery/Driver/findAllDriver');
}
export async function queryByDate(params) {
    return request('/delivery/Transportation/findByTransDate', {
        params: { date:params },
    });
}
export async function queryByLine(params) {
    return request('/delivery/Transportation/findByLine', {
        params: { transNam: params },
    });
}

export async function updateDriver(params) {
    return request('/delivery/Driver/UpdateDriver', {
        method: 'POST',
        data: params,
    });
}
export async function updateDriverState(params) {
    return request('/delivery/Driver/UpdateDriverStatus', {
        method: 'POST',
        data: params,
    });
}
export async function createDriver(params) {
    return request('/delivery/Driver/CreateDriver', {
        method: 'POST',
        data: params,
    });
}
export async function deleteDriver(params) {
    return request('/delivery/Driver/DeleteDriver', {
        params: { dId: params },
    });
}
